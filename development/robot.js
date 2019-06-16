async function main(tank) {

    // variables 

    let drivingSpeed = 50;
    let i = 0;
    let angulo = -1;
    let detectado = false;

    // funciones

    async function avanzarIzq() {
        await tank.drive(180, drivingSpeed);
    }

    async function avanzarArriba() {
        await tank.drive(90, drivingSpeed);
    }

    async function avanzarAbajo() {
        await tank.drive(270, drivingSpeed);
    }

    async function avanzarDer() {
        await tank.drive(0, drivingSpeed);
    }

    async function disparar(grados) {
        await tank.shoot(grados + 5, 700);
        await tank.shoot(grados - 5, 700);
    }

    async function dispararRafaga(grados) {
        await tank.shoot(grados + 15, 400);
        await tank.shoot(grados, 400);
    }


    async function avanzar(grados) {
        await tank.drive(grados, drivingSpeed);
    }

    async function frenar() {
        await tank.drive(0, 0);
    }

    async function puedoAvanzar() {
        return !((await tank.getX() <= 210) || (await tank.getX() >= 1130) || (await tank.getY() <= 210) || (await tank.getY() >= 790));
    }

    async function getRespawn() {          // 12 arriba, 3 derecha, 6 abajo, 9 izquierda, como las agujas del reloj
        if (await tank.getY() > ((1340 / 2) + 100)) {
            return 12;
        } else if (await tank.getY() < ((1340 / 2) - 200)) {
            return 6;
        } else if (await tank.getX() > (1000 / 2)) {
            return 3;
        } else {
            return 9;
        }
    }

    async function salirDeBordes(){
        if (await tank.getX() > 1200) {
            angulo = 180;
            i = 135;
            await disparar(180);
            while (await tank.getX() > 1200) {
                await tank.drive(210, drivingSpeed);
                await disparar(180);
            }
        } else if (await tank.getX() < 200) {
            angulo = 0;
            i = 315;
            await disparar(0);
            while (await tank.getX() < 200) {
                await tank.drive(25, drivingSpeed);
                await disparar(0);
            }
        }
        else if (await tank.getY() > 800) {
            angulo = 270;
            i = 225;
            await disparar(270);
            while (await tank.getY() > 800) {
                await tank.drive(220, drivingSpeed);
                await disparar(270);
            }
        } else if (await tank.getY() < 200) {
            angulo = 90;
            i = 45;
            await disparar(90);
            while (await tank.getY() < 200) {
                await tank.drive(160, drivingSpeed);
                await disparar(90);
            }
        }
    }

    let spawn = await getRespawn();
    switch (spawn) {
        case 12:
            while (await tank.getX() >300) {
                await avanzarIzq();
            }
            i = 180;
            break;
        case 3:
            while (await tank.getY() > 200) {
                await avanzarAbajo();
            }
            i = 90;
            break;
        case 6:
            while (await tank.getX() < 1000) {
                await avanzarDer();
            }
            i = 0;
            break;
        case 9:
            while (await tank.getY() > 200) {
                await avanzarAbajo();
            }
            i = 270;
            break;
    }
    await frenar();

    
    // punto de entrada

    while (true) {
        if (i > 360) {
            i = 0;
        }

        while (!detectado) {
            if (await tank.scan(i, 10) > 0) {
                detectado = true;
                angulo = i;
            } else {
                i = i + 15;
                if (!await puedoAvanzar()) {
                    await salirDeBordes();
                }          
            }
        }

        if (detectado && await puedoAvanzar()) {   // si el tanque detecta a alguien y puede avanzar dispara y avanza
            angulo = i;
            await avanzar(i);       
            await dispararRafaga(i);
            await disparar(i);
            if (await tank.scan(i, 7) == 0) {       
                await dispararRafaga(i);
                await disparar(i);
               detectado = false;
            } else {
                await disparar(i);
                await dispararRafaga(i);
                if(await tank.scan(i + 15, 10) > 0){
                    i = i + 15;
                }else if(await tank.scan(i - 15, 10) > 0){
                    i = i - 15;
                }    
                i -= 15;
                detectado = false;
            }    
        } else if (!await puedoAvanzar()) {
            await salirDeBordes();
            detectado = false;
        } else {
            detectado = false;
            await avanzar(angulo);
            await disparar(angulo);
            await dispararRafaga(angulo);
        }
        i = i + 15;
    }
}


/**
 * Carlos Sánchez Muñoz
 * Adrián Arias Dominguez
 * 
 * Metropolitan Development | www.metropolitandev.es
 */