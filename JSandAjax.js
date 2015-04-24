var faves = null;
var count = 0;

function Gists(jsonObj){
	var desc = jsonObj["description"];
	for (var obj in jsonObj) {
		for (var data in jsonObj.files) {
			var key = jsonObj.files[data];
			var Language = key.language;
		}
	}
	var url = jsonObj.url;
	return {'desc': desc, 'Language': Language, 'url': url};
}

function FavObj(obj){
	var desc = obj['desc'];
	var Language = obj['Language'];
	var url = obj['url'];
	return {'desc': desc, 'Language': Language, 'url': url};
}

function filterResults(thisGist){
	var jsonCx = document.getElementsByName('json_req')[0].checked;
	var pythonCx = document.getElementsByName('python_req')[0].checked;
	var SQLCx = document.getElementsByName('sql_req')[0].checked;
	var JSCx = document.getElementsByName('js_req')[0].checked;
	if(jsonCx){
		if(thisGist.Language === 'JSON'){
			return {'desc': thisGist.desc, 'Language': thisGist.Language, 'url': thisGist.url};
		}
	}
	if(pythonCx){
		if(thisGist.Language === 'Python'){
			return {'desc': thisGist.desc, 'Language': thisGist.Language, 'url': thisGist.url};
		}
	}
	if(SQLCx){
		if(thisGist.Language === 'SQL'){
			return {'desc': thisGist.desc, 'Language': thisGist.Language, 'url': thisGist.url};
		}
	}
	if(JSCx){
		if(thisGist.Language === 'JavaScript'){
			return {'desc': thisGist.desc, 'Language': thisGist.Language, 'url': thisGist.url};
		}
	}
	if(!jsonCx && !pythonCx && !SQLCx && !JSCx)
		return {'desc': thisGist.desc, 'Language': thisGist.Language, 'url': thisGist.url};
	else
		return {'desc': thisGist.desc, 'Language': null, 'url': thisGist.url};;
}

function liGist(Gist) {
	var dl = document.createElement('dl');
	var entry = dlEntry('Description', Gist.desc);
	var link = document.createElement('a');
	link.setAttribute('href', Gist.url);
	link.innerText = entry.dd.innerText;
	dl.appendChild(entry.dt);
	dl.appendChild(link);
	entry = dlEntry('Language', Gist.Language);
	dl.appendChild(entry.dt);
	dl.appendChild(entry.dd);
	var fav = document.createElement('button');
	var t = document.createTextNode('Add Favorite');
	fav.appendChild(t);
	fav.addEventListener("click", function (event){
		 set_fav(Gist);
		 updateFavs(faves);
	})
	dl.appendChild(fav);
	return dl;
}

function set_fav(item){
	faves.Favorites.push(item);
	localStorage.setItem('Favorites', JSON.stringify(faves));
}

function dlEntry(term, definition) {
	var dt = document.createElement('dt');
	var dd = document.createElement('dd');
	dt.innerText = term;
	if(definition === '' || definition === null)
		dd.innerText = 'There was no ' + term + ' given.';
	else
		dd.innerText = definition;
	return {'dt':dt, 'dd':dd};
}

function updateFavs(list){
	var temp = localStorage.getItem('Favorites');
	var holder =  document.getElementById('favs');
	while(holder.hasChildNodes()){
		holder.removeChild(holder.lastChild);
	}
	var tmp;
	var ul = document.getElementById('favs')
	for (var objs in list){
		for (var keys in list['Favorites']){
			var li = document.createElement('li');
			tmp = new FavObj(list['Favorites'][keys]);
			li.appendChild(liFavs(tmp));
			ul.appendChild(li);
		}
	}
}
function update_results() {
	var holder =  document.getElementById('results');
	while(holder.hasChildNodes()){
		holder.removeChild(holder.lastChild);
	}
}

function liFavs(Gist) {
	var dl = document.createElement('dl');
	var entry = dlEntry('Description', Gist.desc);
	var link = document.createElement('a');
	link.setAttribute('href', Gist.url);
	link.innerText = entry.dd.innerText;
	dl.appendChild(entry.dt);
	dl.appendChild(link);
	entry = dlEntry('Language', Gist.Language);
	dl.appendChild(entry.dt);
	dl.appendChild(entry.dd);
	var fav = document.createElement('button');
	var t = document.createTextNode('Remove Favorite');
	fav.appendChild(t);
	fav.addEventListener("click", function (event){
		 rem_fav(Gist);
	})
	dl.appendChild(fav);
	return dl;
}

function rem_fav(item){
	for (var key in faves['Favorites']){
		if(item.url == faves['Favorites'][key].url){
			faves.Favorites.splice(key, 1);
			localStorage.setItem('Favorites', JSON.stringify(faves));
			updateFavs(faves);
		}
	}
}

function makeRequest(){
	update_results();
	var index = document.getElementById("pages_req");
	var numPages = index.options[index.selectedIndex].value;
	var baseUrl = 'http://api.github.com/gists';
	var url;
	for (var i = 1; i <= numPages; i++) {
		var req = new XMLHttpRequest();
		if(!req){
		throw 'Unable to create HttpRequest.';
		}
		url = baseUrl + '?page=' + i;
		makeRequest_2(req, url);
	}	
}

function makeRequest_2(req, url){
	req.onreadystatechange = function(){
		if(this.readyState === 4){
			count = 0;
			var ul = document.getElementById('results');
			var resp = JSON.parse(this.responseText);
			var len1 = resp.length;
			var gistArr = [];
			for(var i = 0; i < len1; i++){
				gistArr[i] = new Gists(resp[i]);
			}
			var filteredArr = [];
			var len2 = gistArr.length;
			for(var i = 0; i < len2; i++){
				var temp = new filterResults(gistArr[i]);
				if (temp.Language != null){
					filteredArr[count++] = temp;
				}
			}
			var len3 = filteredArr.length;
			for (var i = 0; i < len3; i++){
				var li = document.createElement('li');
				li.appendChild(liGist(filteredArr[i]));
				ul.appendChild(li);
			}
		}
	}	
	req.open('GET', url);
	req.send(); 
}

window.onload = function(){
	var temp = localStorage.getItem('Favorites');
	if( temp === null) {
		faves = {'Favorites':[]};
		localStorage.setItem('Favorites', JSON.stringify(faves));
	}
	else {
		faves = JSON.parse(temp);
		updateFavs(faves);
	}
}

