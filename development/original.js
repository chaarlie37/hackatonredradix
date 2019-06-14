async function main(tank) {
	
	// variables 
	
	let limitLeft = 200;
	let limitRight = 1000;
	let drivingSpeed = 50;
	let i = 0;

	let angulo = -1;
	let puedoDisparar = true;
	let parado = true;
	
	// funciones
	
	async function stop() {
			await tank.drive(0, 0);
		
	}

	async function avanzarIzq(){
		if (await puedoAvanzar()) {
			await tank.drive(180, drivingSpeed);
		}
	}

	async function avanzarArriba(){
		if (await puedoAvanzar()) {
			await tank.drive(90, drivingSpeed);
		}
	}

	async function avanzarAbajo(){
		if (await puedoAvanzar()) {
			await tank.drive(270, drivingSpeed);
		}
	}

	async function avanzarDer(){
		if (await puedoAvanzar()) {
			await tank.drive(0, drivingSpeed);
		}
	}

	async function disparar(grados){
		await tank.shoot(grados + 5, 700);
		await tank.shoot(grados - 5, 700);
	}

	async function dispararRafaga(grados){
		await tank.shoot(grados + 10, 200);
		await tank.shoot(grados - 10, 200);
	}

	async function avanzar(grados){
		if(await puedoAvanzar()){
			await tank.drive(grados, drivingSpeed);
		}
		
	}

	async function frenar(){
		await tank.drive(0, 0);
	}

	async function puedoAvanzar(){
		return !((await tank.getX() <= 200) || (await tank.getX() >= 1140) || (await tank.getY() <= 200) || (await tank.getY() >= 800));
	}


	async function moverseLados(){
		if(await tank.getX() < 1000){
			await tank.drive(0, drivingSpeed);
		}
	}

	

	
	// punto de entrada
	
	while (true) {
		if(i > 360){
			i = 0;
			
		}
		if(await tank.scan(i, 10) > 0 && await puedoAvanzar()){
			angulo = i;
			await avanzar(i);
			await disparar(i);
			await dispararRafaga(i);
			i = i - 30;
		}else if(!await puedoAvanzar()){
			if(await tank.getX() > 1100){
				angulo = 180;
				while(await tank.getX() > 1100){
					await tank.drive(180, drivingSpeed);
				}
			}else if(await tank.getX() < 200){
				angulo = 0;
				while(await tank.getX() < 200){
					await tank.drive(0, drivingSpeed);
				}
			}
			else if(await tank.getY() > 800){
				angulo = 270;
				while(await tank.getY() > 800){
					await tank.drive(270, drivingSpeed);
				}
			}else if(await tank.getY() < 200){
				angulo = 90;
				while(await tank.getY() < 200){
					await tank.drive(90, drivingSpeed);
				}
			}

				await disparar(angulo);
				await dispararRafaga(angulo);
				
		}else{
				await avanzar(angulo);
				await dispararRafaga(angulo);
		}
		
		i = i + 25;
		
		
	}
}
