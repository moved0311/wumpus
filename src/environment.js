var gridx = 4;
var gridy = 4;
var t = document.getElementsByTagName('table')[0];
for(var i = 0; i < gridx; i++){
	var tr = document.createElement('tr');
	for(var j = 0; j < gridy; j++){
		var td = document.createElement('td');
		td.className = 'pos'+(j)+(gridy-i-1);

		var img1 = document.createElement('div');
		img1.className = 'img1_'+(j)+(gridy-i-1);
		td.appendChild(img1);
		
		var img2 = document.createElement('div');
		img2.className = 'img2_'+(j)+(gridy-i-1);
		td.appendChild(img2);

		tr.appendChild(td);
	}
	t.appendChild(tr);
}
