// [ Сцена: загрузка файлов ]
scenes.preloader = {
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //-----------------------------------------------------------------------------------------
        //Полоса прогресса закачки ----------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        progressbar: {
            //Ресурсы объекта ---------------------------------------------------------------------
            resources: {
                logo: {
                    type: 'image64', file: 
                    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPkAAACJCAMAAADZs25jAAAAUVBMVEUAAAAAAAAA'+
                    'ADMzAABmAACZAAAAMwAAMzMzMwAzMzNmMwBmMzOZMwDMMwD/MwBmZmaZZgCZZjPMZgDMZjP/ZgD/ZjOZmZn/mQ'+
                    'D/mTPMzMz///9mBTHqAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAt6'+
                    'SURBVHja7V2JYps4EBWb7q7lOlZLQKD8/4cuuq/RBbLjbJHrgjFgpDfvzWgkCEI7C0ssz3KWs5zlLGc5y+sVVu'+
                    'nHWWH/r/p8lrOcpW/MfsbwZznL9+fy3jfq9HnP8izPUPaz/F/QfZV3jQacpbcV1KLSo2d4ltfw47nXa2rCWfpw'+
                    'myWWbcp8BMUT1ef48ZZXC5r7LOgLOP4HGFw74ujLVP5JEPyP0O7D7a965S3tIET5poh/6o/i+FcgnEe8a1PUOb'+
                    'Jvz/XEiwHvl7OKLui3GfzznNcDPEyR4y+Neleut4Uyj0e9Q1zBWjgu0YXKt+B7YxOFzUARhsuXODa4qr05LlDF'+
                    'Q7q8JuKdOJ6r+PAiiLPOii4QJ0O2ULkfFdZPNPfFRyLXybYithP9Pf+KKsIQcywV3znbiVwh3jURsYnvjNQZOT'+
                    'iY9gmtvJ8aCjW3e3HjIFIXXIvQS6L35ivIsRq9htXeajs1q8S5Htfa9BmxOLavE9OQj9O4lfdxHsdpnrYV/llh'+
                    'LpCS6GNedfEBU0pkQ4hP/Fy6YcSKrVZ8rL+d6OOl2PJPWBCQiGYgstlxP7nz2vg6ybKI/5Fc/nQkjqrWl1joC9'+
                    'GfLJoY6QuV31HgWHe7tiDsXg8yzYHtMZ05rnV9nNdpWnnV1w1yWT6UhUpeK/T5Qhiz5DO/dvW/QlPvqw8IjmXB'+
                    'dqkhAlpm1tXOWO5CTNMe9Od+M0hbv6nKbpVf1lU0wTR62u7iFm6liqkuO8UnCtuLu93anY+5PidnOFHfHlB4AH'+
                    'Vj6+tkDF6sLldX2TUnmWKwRkiuSkywFiuhR4qvmyi7xzK7nYhVeR5sGlN+T4j+DRpKIOrUBMrWDcM5xydh76NV'+
                    'Ywc3bBnMkJUereDYYbIRdO/YcLuNKCig7a569Es4aaYN+KqrrXC3FR9MDC+hMpKs/bplI9XmwKRxUusGHTmPtl'+
                    'u9oJbnG+ZyD22VNB3asH2+XFzOZbEk5//N3ACuri9XmA8uwmarYjihvBEUw+O9bCjsb0/x3BIAm+86oi7k7fKx'+
                    'GLhXDfv4r6omC3iuUWAmFqByyXWICJ8ttykTd44djD93tjPDbZ9WzIRF2A+hD0RvKIje3iaJ8rRs71niP0YxO3'+
                    'UswFyUwY86HMdBZOdqxJDGPPDndqnP1yf3Jousnqi0wnqZhb1PP/4arNv1/LlAS9LSLnVUoH061sJAjIYrK8Dh'+
                    'dh1SEOb48+0rolQmwnynP2cxy39zlO/TfdF4b83wjgc/ePAxl1UWGu8pMnZ8ehifU8Nmf7sKVKG4XZ37MM9jXy'+
                    '5Pr81cu/PpPk9G152cHNbRnOqVSTdrvseKs1TH7rYLSPWxQgP97dJEiM38aEscMLFNQfp0Wv1e+Wi9GYd8WTZ/'+
                    'Huo6/KKJzzSzL93Vc6d7Ek5pxLUr1z58XQ3yhqtgTu6Z74pUBWs2eiVvsrKzZvg8T+vlubmYByahwNybY+s6Wl'+
                    'cC90v2jT/LKLCG0Zocqqxwvr5NoHoqy13H6qZIW/9En98RbVaZbR1t59SIu2TB51Yy+ff6d3g86831Cs67TSA9'+
                    'y8dduHIZr6t4ZoRScansO8GIvCrPE6iL+vyUSRiRh9nc2Sqi9rGQh3XRwE5sv4fjHZS92ZeLarxLZRNgz8rm13'+
                    'zNhzgGHMjrcj1SXhlcX5dFBukK+oWn4pbxlh138KM6k7xIcpwSoqlCeBKdQpohdpQF0ILjI6sBVlilGpfJkTle'+
                    'bj8vmt55zIujMASX7UbF7a6ogNrRxZ8To+urrvBdYK4+rLa/LuyAl/eY58QMH0A8pxnTIWa/5E561KYT190MiU'+
                    'iwo6226+Qhv47Gv9tODBohtPwxGD/SxnVqkdsJ70E86c9NtnWwRj5v1b6LpeL8yrussj22pfD5b3+5oTxyevc6'+
                    'O+NxFhcGrIiXIMjul+F7Nde9dr7Z9LK3NjmsF7IvXN2PIeqvO8YeXdJQrlHViB6cktir8JJaF5N444txHcdxXt'+
                    '8nz/BF523k31/h/roxdh91XK4Ptplbl9oEx8fijjzPXdLWaUVS70bVNrNJylF4BLYdcS9bH6Mb1N706XdyvfbC'+
                    'RtVrXXS9N9/ncRNWduu/h5pC1f4A9b1sjmdVh/15fp7Ab6cLo7Qdg5FaQtmrKg5hDp89jhKP+PMhb+4m864i2q'+
                    's7omrfsLLjSshjngfnp9DkhSM8l02AeeQUvWX3bVb9de3Prnk24yzHt2hMjJOjTbwQoNeZiUg0wfUj+XZw/tvW'+
                    'HVfZKd11kSs3d3gNUHbi9rt9oDCNfoVuYTxxPnuY+/13/2SYVXGd1ebb3dcnMcYu/bjQuA9rnhXK3jynKjv5jI'+
                    'Jn26Hw2VyZpuh1seOp3O7fgjgbOSMuobIjAnI5907zPDof6+TToZfssutkhfiHU8EEBlSXtc+iK0w4hKP4Y7k4'+
                    'FMfaYRL6rtUNA/1pCCkKeOeAu+ES4DkCYgYbQe5HPT3TUPzKD91RFUy//lNCA6d8MOuCOYNi/U7ZmcA/85B1lp'+
                    'n32QlaIzQcY7fb/dCD7eQ5gn5HEYj1H3pQKP6DnIlC0yUzulZQdtQJcwRNPe5574qm1MXmIpbVindW2Q1niet9'+
                    'YW5HJcNzxkKiR1maxtg90RTSp80iC8vrv1yivEiYzgqUHaeDzd2Y053qXiVtrspuln5f7nc7GW5g4BgY6INzvp'+
                    'l6pXiMua4gjmOdJn9H8dKbcGUc9fsty1cwZs/gh1MZtiaeD92U3eW5Cl119mmERlRYOB+euBaR4SyUaCnyPI7d'+
                    'h/wQxE6u64neIikxvucVGlbwZAIJSgiQA5j3mi+DLJ9mPcR0CebAQCM0Lu/CCK7cZ8dZfw7zfOjgz+E57tynie'+
                    '7pFedHTgZwPK0yv+Lh15/nrC12l7DcRMx6n35DmVYgZvd7YyFnrR8Ha17HcwKN6fWcF6dCV9k/+yj55ARKyeQR'+
                    '2Y85GY710Yuxu/Zp3NTf/3WzowDPSSI2B8fN7Lw7QmLOFv05fow/D+5Xu8mI/a04Jl7Os4eR3yBGR2k75hiKAn'+
                    'rey2LnzMxvcKYVxXzOZVAoFLN/tvN8SHRTD08i8dCax3VafmSi9ayy+24NFxGswjyVeu42/1Vc0RsfPr/BvjWe'+
                    'R2eVHUH9czj6wzU8d/vnocD18eeOwouJy7/s9IDsPaNpjHApD9eM+YEIjlVlZcx4eqzMyXtYnZgdubF/GJm7Bb'+
                    'fwPIra6bGxNcjwqeyaz+slLSQRbqWsGaQVrZjj9AyKHvez2ADumh7NCOfEA5nQMD/u3gPTwvM485MY7Ojgz5VP'+
                    'Q1Dbw3c0ptR/yKPeiDnk0lBHxFVlpr+j+W61yh734uKse0RbkOee/8fZmL1HVkZm4MZUtI5qYnaQmcn7yqswH5'+
                    'K+vBvqcsKQF4snM7V5Ywf7ZfxRA7yQoT5uh2ZN9H2gk3PPWpTdhDu4cK/Jac66ORP6lxKVoxnEUTd/TkA1blV2'+
                    '1DhrAsfz4YweRHNGafV8ONas7AkfHTZZwdgTXC88u8LRBEpInMHBXZ8rA4Yf5ftIcMq3pqyoaT5cftJg72fKMJ'+
                    'TKeEBE8XU43QEuwl6tCuRI5JbPymDX9+YRZ1XGjiomvlL/GRfZ6bFH57wWZ0QWboUrKztCrBJ3XDUtcXOGfQ08'+
                    '8eAkXDMAWD0tQMXd8cR+8Rwhrx8u7niA9iqg3aEJarOalpU4uR/kOAkim2ITNTOu7U7XrhyPLm8DBpO6uwNxWd'+
                    'nhOTho9/1u/Z8PByOEMmiaquOSB3jBB6O1XSICuixE8rTl1XTP6Rc8C7J8qtqfbX9M9sOfM/scw/yGTwBtQ/04'+
                    'oVACefTIJwunw4/SE/hLXRr0cKS/SWl5qu8DHlfdNJ5eZZCtUvW45zqz74l6y1N/X+SS6v4qR/8n9iN0/p2WV0'+
                    'QbPY3bJ/q9PUDN9z3/EucXyd0fhip7GudRw1/hYOjQX+X5D547SqxLgMhiAAAAAElFTkSuQmCC'
                }
            },
            
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    img_logo: game.scene.objects.progressbar.resources.logo.data,
                    logo_width: game.scene.objects.progressbar.resources.logo.data.width,
                    logo_height: game.scene.objects.progressbar.resources.logo.data.height,
                    logo_x: 0,
                    logo_y: 0,
                    bar_x: 0,
                    bar_y: 0,
                    bar_width: 0,
                    progress: 0,
                    prev_fps: config.fps_max
                };
                
                this.update();
                
                //Ограничиваем сцену до ~4 fps
                config.fps_max = 4;
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let ltmp = this.tmp;
                let real_center = Math.ceil( ( game.canvas.height + game.canvas.hidden_h ) / 2 );

                //Обновляем лого
                ltmp.logo_x = Math.ceil( ( game.canvas.width / 2) - ( ltmp.logo_width / 2) );
                ltmp.logo_y = Math.ceil( real_center - ( ltmp.logo_height / 2 ) - 10 );
                
                //Обновляем контур прогрессбара
                ltmp.bar_width = Math.ceil( ( game.canvas.width / 100) * 80 );
                ltmp.bar_x = Math.ceil( ( game.canvas.width - ltmp.bar_width ) / 2 );
                ltmp.bar_y = Math.ceil( real_center + ( ltmp.logo_height / 2 ) - 10 );
                    
                //Вычисляем, сколько процентов загружено
                if( tmp.download.bytes_load > 0 ) {
                    ltmp.progress =  Math.ceil( ( ( ltmp.bar_width - 10 ) / 100 ) * ( 100 / ( tmp.download.bytes_all / tmp.download.bytes_load ) ) );
                    
                    //Файлы загрузились
                    if( tmp.download.files_load == tmp.download.files_count ) {
                        //Возвращаем прежний fps
                        config.fps_max = ltmp.prev_fps;
                    
                        //Запускаем сцену c меню
                        StartScene( 'menu', function() {
                            //Добавляем дисклеймер на сцену
                            game.scene.objects.disclaimer.add();
                        });
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let context = game.canvas.context;
                let ltmp = this.tmp;
                
                //Рисуем логотип /gd
                context.drawImage( ltmp.img_logo, ltmp.logo_x, ltmp.logo_y );
                
                //Рисуем контур прогрессбара
                context.fillStyle = 'rgb(34,34,34)';
                context.fillRect( ltmp.bar_x, ltmp.bar_y, ltmp.bar_width, 20 );
                    
                //Рисуем полосу прогресса
                context.fillStyle = 'rgb(136,136,136)';
                context.fillRect( ltmp.bar_x + 5, ltmp.bar_y + 5, ltmp.progress, 10 );
            }
        }
    }
};
