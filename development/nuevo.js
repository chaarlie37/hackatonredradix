async function main(tank) {
	
	// variables 
	
	let limitLeft = 200;
	let limitRight = 1000;
	let drivingSpeed = 60;
	let i = 0;

	let angulo = -1;
	let puedoDisparar = true;
	let parado = true;

	let detectado = false;
	let principio = true;
	
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
		await tank.shoot(grados + 1, 600);
		await tank.shoot(grados - 1, 600);
	}

	async function dispararRafaga(grados){
		await tank.shoot(grados + 15, 300);
		await tank.shoot(grados - 10, 300);
	}

	async function dispararRecto(grados){
		await tank.shoot(grados, 300);
		//await tank.shoot(grados, 300);
	}

	async function dispararDefensa(){
		/*
		for(let j = 0; j<360; j = j+45){
			await tank.shoot(j, 50);
		}
		*/
		await tank.shoot(0, 700);
		await tank.shoot(180, 700);
	}

	async function dispararDefensaGrados(n){
		await tank.shoot(n, 400);
		await tank.shoot(-n, 400);
	}

	async function avanzar(grados){
		//if(await puedoAvanzar()){
			await tank.drive(grados, drivingSpeed);
		//}
		
	}

	async function frenar(){
		await tank.drive(0, 0);
	}

	async function puedoAvanzar(){
		return !((await tank.getX() <= 210) || (await tank.getX() >= 1130) || (await tank.getY() <= 210) || (await tank.getY() >= 790));
	}


	async function moverseLados(){
		if(await tank.getX() < 1000){
			await tank.drive(0, drivingSpeed);
		}
    }



	

	
	// punto de entrada


	await dispararDefensa();
	if(await tank.getX() > 500 && await tank.getY() > 500){
		await avanzarAbajo();
	}else{
		await avanzarArriba();
	}


	await avanzar(180);
	
	while (true) {
		if(i > 360){
			i = 0;		
		}

		if(!puedoAvanzar && !detectado){
			angulo = -angulo;
			i = -i;
			
		}




		while(!detectado){
            if (await tank.scan(i, 10)) {
                detectado = true;
                angulo = i;
            
            } else {
                i = i + 15;
                
                if (!await puedoAvanzar()) {
                    if (await tank.getX() > 1100) {
                        angulo = 180;
                        i = 180;
                        await disparar(180);
                        while (await tank.getX() > 1100) {
                            await tank.drive(180, drivingSpeed);
                            await disparar(180);
                        }
                    } else if (await tank.getX() < 200) {
                        angulo = 0;
                        i = 0;
                        await disparar(0);
                        while (await tank.getX() < 200) {
                            await tank.drive(0, drivingSpeed);
                            await disparar(0);
                        }
                    }
                    else if (await tank.getY() > 800) {
                        angulo = 270;
                        i = 270;
                        await disparar(270);
                        while (await tank.getY() > 800) {
                            await tank.drive(270, drivingSpeed);
                            await disparar(270);
                        }
                    } else if (await tank.getY() < 200) {
                        angulo = 90;
                        i = 90;
                        await disparar(90);
                        while (await tank.getY() < 200) {
                            await tank.drive(90, drivingSpeed);
                            await disparar(90);
                        }
                        
                    }
                }
                
            }
            
			
		}

		if(detectado && await puedoAvanzar()){   // si el tanque detecta a alguien y puede avanzar dispara y avanza
            angulo = i;
			await avanzar(i);
            await dispararRafaga(i);
				
				//await disparar(i);
				/*
			}else if (await tank.scan(i-7, 2)){
				//await disparar(i);
				await dispararRafaga(i-5);
				await disparar(i-5);
				
			}else{
				*/
				
            if (await tank.scan(i, 7) < 0) {
                detectado = false;
                //await dispararRafaga(i);
            } else {
                await disparar(i);
                await dispararRafaga(i);
                
            }
					
			//await dispararLejos(angulo);
			i -= 15;
			detectado = false;
		}else if(!await puedoAvanzar()){
			if(await tank.getX() > 1100){
				angulo = 180;
				await disparar(180);
				while(await tank.getX() > 1100){
					await tank.drive(180, drivingSpeed);
					await disparar(180);
				}
			}else if(await tank.getX() < 200){
				angulo = 0;
				await disparar(0);
				while(await tank.getX() < 200){
					await tank.drive(0, drivingSpeed);
					await disparar(0);
				}
			}
			else if(await tank.getY() > 800){
				angulo = 270;
				await disparar(270);
				while(await tank.getY() > 800){
					await tank.drive(270, drivingSpeed);
					await disparar(270);
				}
			}else if(await tank.getY() < 200){
				angulo = 90;
				await disparar(90);
				while(await tank.getY() < 200){
					await tank.drive(90, drivingSpeed);
					await disparar(90);
				}
				detectado = false;
			}
		}else{
				detectado = false;
				await avanzar(angulo);
				await dispararRafaga(angulo);
		}
		
		i = i + 15;
		
		
	}
}
