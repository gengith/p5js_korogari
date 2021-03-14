// TouchedTexts
let version = "1.0";
let main;
let touchinput = {
	x: -1,
	y: -1
};

class Main {

	constructor() {
		this.sequence = 2;  //メニュー画面
		this.menu = new Menu();
		this.game = new Game();
		this.clear = new Clear();
	}

	touchproc() {
		touchinput.x = -1;
		touchinput.y = -1;
	}

	draw() {
		background('rgb(255,255,255)');
		if (this.sequence === 1){  //メニュー画面
			this.menu.proc();
			this.menu.draw();
			this.sequence = this.menu.setMainSequence(1);
		} else if (this.sequence === 2){  // ゲームメニュー1
			this.game.proc();
			this.game.draw();
			this.sequence = this.game.setMainSequence(2);
		} else if (this.sequence === 102){  // ゲームクリア画面
			this.clear.proc();
			this.clear.draw();
			this.sequence = this.clear.setMainSequence(102);
		} else {
		}
		
		
	}

}

class Menu {

	init() {
		this.select = 2;  //メニュー選択位置
		this.setMainSequenceFlag = false;
	}

	constructor() {
		
		this.selectmenu = [  // メニュー文字、メニュー位置ｘ、メニュー位置y、メニュー色、メニュー文字サイズ、選択判定bool、選択判定ｘ1、選択判定y1、選択判定ｘ2、選択判定y2、セレクト先
			['Menu',100,100,'white',50,false,0,0,0,0,0],
			['version ' + version,250,100,'black',10,false,0,0,0,0,0],
			['はじめる',100,200,'black',50,true,70,230,350,130,2]
		];
		this.init();
	}




	setMainSequence(pdefault) {
		if (this.setMainSequenceFlag) {
			let tmp_select = this.select;
			this.init();
			return this.selectmenu[tmp_select][10];
		}
		return pdefault;
	}

	proc() {
	
		for (let i = 0; i < this.selectmenu.length; i++) {
			if ( this.selectmenu[i][5] && touchinput.x > this.selectmenu[i][6] && touchinput.x < this.selectmenu[i][8] && touchinput.y < this.selectmenu[i][7] && touchinput.y > this.selectmenu[i][9] ) {
				this.select = i;
				this.setMainSequenceFlag = true;
				break;
			}
			
			noFill();
			rect(this.selectmenu[i][6],this.selectmenu[i][7],this.selectmenu[i][8] - this.selectmenu[i][6],this.selectmenu[i][9] - this.selectmenu[i][7]);
			
		}
	}


	draw() {
	
		for (let i = 0; i < this.selectmenu.length; i++) {
			textSize(this.selectmenu[i][4]);
			fill(this.selectmenu[i][3]);
			if (this.select === i) {
				fill('red');
			}
			text(this.selectmenu[i][0],this.selectmenu[i][1],this.selectmenu[i][2]);
		}

	}

}


class Game {

	init() {
		this.player[0] = 400; this.player[1] = 1700; this.player[2] = 200; this.player[3] = 200;
		this.camera[0] = 0; this.camera[1] = 0;
		this.vx = 20;
		this.vy = 20;
	}

	constructor() {
		this.player = [400,1700,200,200];  // 0:プレイヤー位置x, 1:プレイヤー位置y, 2:プレイヤーサイズx, 3:プレイヤーサイズy
		this.camera = [0,0]; // 0:カメラ位置x, 1:カメラ位置y
		this.vx = 20; // 移動速度
		this.vy = 20;
		
		this.kouten = [-1,-1]; // 地面との当たり判定座標
		this.lineobject = [ 
			[0,1800,6000,1800],
			[6000,1800,8000,1000],
			[8000,1800,10000,1800],
			[10000,2600,12000,1000]
		];
		this.scale = 10;
		
		this.init();
		
	}

	setMainSequence(pdefault) {
		
		let hantei = false;
		
		if (hantei) {
			this.init();
			return 102;
		}
		
		return pdefault;
	}

	gaiseki(px1, py1, px2, py2) {
		return (px1 * py2 - py1 * px2);
	}

	linehantei(px1, py1, px2, py2, px3, py3, px4, py4) {
		let eps = 0.00001;
		let gaiseki_ab_cd = this.gaiseki( px2-px1, py2-py1, px4-px3, py4-py3 );
		if( gaiseki_ab_cd === 0) {
			return false;
		}
		let gaiseki_ac_cd = this.gaiseki( px3-px1, py3-py1, px4-px3, py4-py3 );
		let gaiseki_ac_ab = this.gaiseki( px3-px1, py3-py1, px2-px1, py2-py1 );
		
		let t1 = gaiseki_ac_cd / gaiseki_ab_cd;
		let t2 = gaiseki_ac_ab / gaiseki_ab_cd;
		if ( 0 < t1 + eps && t1 - eps < 1 && 0 < t2 + eps && t2 - eps < 1 ) {
			this.kouten[0] = px1 + t1 * (px2-px1);
			this.kouten[1] = py1 + t1 * (py2-py1);
			return true;
		}
		return false;
	}

	proc() {
		
		//移動判定X
		this.kouten[0] = -1; this.kouten[1] = -1;
		let moveXhantei = false;
		for( let i = 0; i < this.lineobject.length; i++) {
			if ( this.linehantei( this.player[0] + this.player[2] / 2, this.player[1], this.player[0] + this.player[2] / 2 + this.vx, this.player[1], this.lineobject[i][0], this.lineobject[i][1], this.lineobject[i][2], this.lineobject[i][3] ) ) {
				moveXhantei = true;
				break;
			}
		}
		//移動処理X
		if ( moveXhantei ) {
			let tmp_player_positionX = this.player[0];
			this.player[0] = this.kouten[0] - this.player[2] / 2;
			this.camera[0] += this.kouten[0] - this.player[2] / 2 - tmp_player_positionX;
		} else {
			this.player[0] += this.vx;
			this.camera[0] += this.vx;
		}
		
		//移動判定Y
		this.kouten[0] = -1; this.kouten[1] = -1;
		let moveYhantei = false;
		for( let i = 0; i < this.lineobject.length; i++) {
			if ( this.linehantei( this.player[0], this.player[1], this.player[0], this.player[1] + this.player[3] / 2 + this.vy+10, this.lineobject[i][0], this.lineobject[i][1], this.lineobject[i][2], this.lineobject[i][3] ) ) {
				moveYhantei = true;
				break;
			}
		}
		//移動処理Y
		if ( moveYhantei ) {
			let tmp_player_positionY = this.player[1];
			this.player[1] = this.kouten[1] - this.player[3] / 2;
			this.camera[1] += this.kouten[1] - this.player[3] / 2 - tmp_player_positionY;
		} else {
			this.player[1] += this.vy;
			this.camera[1] += this.vy;
		}
		
		//★test
		ellipse((this.kouten[0]-this.camera[0])/this.scale, (this.kouten[1] - this.camera[1])/this.scale, 10,10);
		text( "playerX座標" + this.player[0],width - 300, height - 300);
		text( "playerY座標" + this.player[1],width - 300, height - 280);
		text( "交点X座標" + this.kouten[0],width - 300, height - 260);
		text( "交点Y座標" + this.kouten[1],width - 300, height - 240);
		text( "touchX:" + touchX,width - 300, height - 220);
		text( "touchY:" + touchY,width - 300, height - 200);
		
	}

	draw() {
		ellipse( (this.player[0] - this.camera[0])/this.scale, (this.player[1] - this.camera[1])/this.scale,this.player[2]/this.scale,this.player[3]/this.scale);
		for (let i = 0; i < this.lineobject.length; i++) {
			line( (this.lineobject[i][0] - this.camera[0])/this.scale, (this.lineobject[i][1] - this.camera[1])/this.scale, (this.lineobject[i][2] - this.camera[0])/this.scale, (this.lineobject[i][3] - this.camera[1])/this.scale);
		}
		
		
	}

}

class Clear {

	init() {
		this.select = 1;  //メニュー選択位置
		this.setMainSequenceFlag = false;
	}

	constructor() {

		this.selectmenu = [  // 0:メニュー文字、1:メニュー位置ｘ、2:メニュー位置y、3:メニュー色、4:メニュー文字サイズ、5:選択判定bool、6:選択判定ｘ1、7:選択判定y1、8:選択判定ｘ2、9:選択判定y2、10:セレクト先
			['Congraturation!!!',100,100,'white',50,false,0,0,0,0,0],
			['戻る',100,200,'black',50,true,70,230,350,130,1]
		];
		this.init();

	}




	setMainSequence(pdefault) {
		if (this.setMainSequenceFlag) {
			let tmp_select = this.select;
			this.init();
			return this.selectmenu[tmp_select][10];
		}
		return pdefault;
	}

	proc() {
	
		for (let i = 0; i < this.selectmenu.length; i++) {
			if ( this.selectmenu[i][5] && touchinput.x > this.selectmenu[i][6] && touchinput.x < this.selectmenu[i][8] && touchinput.y < this.selectmenu[i][7] && touchinput.y > this.selectmenu[i][9] ) {
				this.select = i;
				this.setMainSequenceFlag = true;
				break;
			}
			
			noFill();
			rect(this.selectmenu[i][6],this.selectmenu[i][7],this.selectmenu[i][8] - this.selectmenu[i][6],this.selectmenu[i][9] - this.selectmenu[i][7]);
			
		}
	}


	draw() {
	
		for (let i = 0; i < this.selectmenu.length; i++) {
			textSize(this.selectmenu[i][4]);
			fill(this.selectmenu[i][3]);
			if (this.select === i) {
				fill('red');
			}
			text(this.selectmenu[i][0],this.selectmenu[i][1],this.selectmenu[i][2]);
		}

	}

}



function preload() {
}


function setup(){
	window.addEventListener("touchstart", function (event) { event.preventDefault(); }, { passive: false });
	window.addEventListener("touchmove", function (event) { event.preventDefault(); }, { passive: false });
	createCanvas(windowWidth, windowHeight);
	background('rgb(255,255,255)');
	main = new Main();
}

function draw(){
	main.draw();
	main.touchproc();
}



	
function touchStarted(){
  touchinput.x = touchX
  touchinput.y = touchY
  return false;
}