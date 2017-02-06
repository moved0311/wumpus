(function(){
var wumpus = {
	board: [],
	numGrid: 4,
	numTotalGrid: 16,
	numGoal: 1,
	numWumpus: 1,
	numPit: 3,
	posPlayer: 0,
	hide: true,
	find: false,

	// 0. init
	init: function(){ 
		this.initCharacter();		// 1.
		this.checkState();
		this.drawCharacter();
		this.bindKeyEvent();		// 4.
		this.run();
	},
	// 1. initCharacter
	initCharacter: function(){
		for(var g = 0; g < this.numGoal; g++){
			this.board.push('g');
		}
		for(var w = 0; w < this.numWumpus; w++){
			this.board.push('w');
		}
		for(var p = 0; p < this.numPit; p++){
			this.board.push('p');
		}
		while(this.board.length < this.numTotalGrid -1 ){
			this.board.push('s');	
		}
		this.shuffle(this.board); 					// 1.1

		var player = ['player'];
		this.board = player.concat(this.board);
		this.drawCharacter(); 						// 2.
	},
	// 1.1 shuffle
	shuffle: function(a){
		for(let i = a.length; i; i--){
			let j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
		}
	},
	// 2. drawCharacter
	drawCharacter: function(){
		var that = this;
		var pos_play = this.getPos(this.posPlayer);
		var $divPlayer = $(".pos"+pos_play[0]+pos_play[1]); 

		for(var i = 0; i < this.board.length; i++){
			var pos = this.getPos(i);			// 3.
			var img = "";
			var checked = 0;
			var $div  = $(".pos"+pos[0]+pos[1]);
			var $img1 = $(".img1_"+pos[0]+pos[1]);
			var $img2 = $(".img2_"+pos[0]+pos[1]);

			//clean css
			$div.css("background", ""); 

			var state = this.board[i];
			if(state === 'g'){
				img = "gold.png";
			}else if(state === 'w'){
				img = "dragon.png";
			}else if(state === 'p'){
				img = "trap.png";
			}else if(state === 'player' || state === 'closeTwo'
				  || state === 'closeW' || state === 'closeP'){
				img = "francis.png";
			}else if(state === 'checked'){
				checked = 1;
			}else{
				img ="";
			}

			var drawImg = {
				"background": "url( ../res/" + img + ") no-repeat center",
  		  		"background-size": "50px 50px"
			};

			if(that.hide === false){
				$div.css(drawImg);
			}

			if(img === "francis.png" ){
				$div.css(drawImg);
				$div.css("background-color" , "#D3D3D3");
				
				if(that.find === true){
					$div.css('background-color', "yellow");
				}
			}

			// color check move
			if(checked){
				$div.css("background-color" , "#D3D3D3");
			}
			// color gold pos
			if(that.find){
				$divPlayer.css('background-color', "yellow");
			}
			//draw hint 
			var closeW = {
				"background": "url(../res/i-draining.png) no-repeat",
				"display": "block",
				"width": "50%",
				"height": "100%",
				"float": "left",
				"background-size": "auto",
				"position": "relative",
				"top": "45px",
				"left": "-10px",
			}
			var closeP = {
				"background": "url(../res/air.png) no-repeat",
				"display": "block",
				"width": "50%",
				"height": "100%",
				"float": "right",
				"background-size": "auto",
				"position": "relative",
				"top": "47px",
				"right": "-10px",
			}
			
			if(state === 'closeTwo'){
				$img1.css(closeW);
				$img2.css(closeP);
			}else if(state === 'closeW'){
				$img1.css(closeW);
			}else if(state === 'closeP'){
				$img2.css(closeP);
			}


		}
	},

	// 3. getPos
	getPos: function(i){
		var res = [];
		res.push(i % this.numGrid);
		res.push(Math.floor(i / this.numGrid));
		return res;
	},
	// 4. bindKeyEvent
	bindKeyEvent: function(){
		var that = this;
		document.addEventListener("keydown",function(e){
			var key = '';
			switch(e.keyCode){
				case 37:
					key = 'L';
					break;
				case 38: 
					key = 'U';
					break;
				case 39:
					key = 'R';
					break;
				case 40:
					key = 'D';
					break;
				default:
					break;	
			}
			that.move(key); // 4.1
		});

	},
	// 4.1 move
	move: function(key){
		var x = this.getPos(this.posPlayer)[0];
		var y = this.getPos(this.posPlayer)[1];
		var tmpx = x;
		var tmpy = y;
		switch(key){
			case 'U':
				tmpy++;
				break;
			case 'D':
				tmpy--;
				break;
			case 'L':
				tmpx--;
				break;
			case 'R':
				tmpx++;
				break;
		}
		
		if(tmpx >= 0 && tmpx < this.numGrid && tmpy >= 0 && tmpy < this.numGrid){
			this.find = this.isGold(tmpx, tmpy);
			this.board[this.setPos(x,y)] = 'checked';		
			var Die = this.isDie(tmpx,tmpy);					
			this.board[this.setPos(tmpx,tmpy)] = 'player';	
			this.posPlayer = this.setPos(tmpx,tmpy);		
			
			this.checkState();
			this.drawCharacter();
		}

		if(Die){
			this.gameover();								
		}

	},
	// 5. setPos
	setPos: function(x, y){
		return y * this.numGrid + x; 
	},
	// 6. isDie
	isDie: function(x, y){
		var pos = this.setPos(x,y);
		if(this.board[pos] === 'w' || this.board[pos] === 'p'){
			return true;
		}
		return false;
	},
	isGold: function(x, y){
		var pos = this.setPos(x, y);
		if(this.board[pos] === 'g'){
			return true;
		}
		return false;
	},
	checkState: function(){
		var up    = this.posPlayer + this.numGrid;
		var down  = this.posPlayer - this.numGrid;
		var left;
		var right

		//if it is most left or right
		left =  (this.posPlayer % this.numGrid === 0) ? this.posPlayer : this.posPlayer - 1;
		right = (this.posPlayer % this.numGrid === this.numGrid - 1) ? this.posPlayer : right = this.posPlayer + 1;

		
		var res = ['false','false'];
		if( this.board[up] === 'w'   || this.board[down] === 'w'  
		 || this.board[left] === 'w' || this.board[right] === 'w'){
			res[0] = 'true';
		}
		if( this.board[up] === 'p'   || this.board[down] === 'p' 
		 || this.board[left] === 'p' || this.board[right] === 'p'){
		 	res[1] = 'true';
		}

		
		if(res[0] === 'true' && res[1] === 'false'){
			this.board[this.posPlayer] = 'closeW';
		}if(res[0] === 'false' && res[1] === 'true'){
			this.board[this.posPlayer] = 'closeP';
		}
		if(res[0] === 'true' && res[1] === 'true'){
			this.board[this.posPlayer] = 'closeTwo';
		}
	},
	gameover: function(){
		swal({  title: "You Are Die!",   
		  	 	confirmButtonColor: "#DD6B55",   
		  	 	confirmButtonText: "OK  :(",   
		  	 	}, 
		  	 	function(){ window.location.reload(); 
		});
	},
	run: function(){
		var $checkbox = $(':checkbox');

		var that = this;
		$checkbox.change(function(){
			if($checkbox.is(":checked")){
				that.hide = false;
			}else{
				that.hide = true;
			}
			that.drawCharacter();
		});
	},

}
wumpus.init();
})();