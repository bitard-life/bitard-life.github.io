// [ Сцена: вспомогательные утилиты ]
scenes.utilities = {
    //Объекты сцены -------------------------------------------------------------------------------
    objects: {
        //-----------------------------------------------------------------------------------------
        //Редактор анимаций персонажей ------------------------------------------------------------
        //-----------------------------------------------------------------------------------------
        body_editor: {
            //Инициализация объекта ---------------------------------------------------------------
            init: function() {
                //Создаем временные переменные
                this.tmp = {
                    object: null,
                    body: null,
                    sel_part: 0,
                    sel_point: 1,
                    control: {
                        wheel: game.cursor.wheel,
                        tab: game.keyboard.tab,
                        up: game.keyboard.up,
                        down: game.keyboard.down,
                        left: game.keyboard.left,
                        right: game.keyboard.right
                    }
                }
            },
            
            //Подключение к телу ------------------------------------------------------------------
            select: function( body ) {
                if( body.tmp.body === undefined ) {
                    console.log( 'body_editor.select(); -> Не найдены опорные точки!');
                    return;
                }
                console.log( this );
                
                //Подключаемся
                this.tmp.object = body;
                this.tmp.body = body.tmp.body;
            },
            
            //Обновление объекта ------------------------------------------------------------------
            update: function() {
                //Получаем короткие ссылки
                let body = this.tmp.body;
                
                if( body === null ) return;
                
                //Преключаемся на другую часть тела
                if( this.tmp.control.tab !== game.keyboard.tab ) {
                    let max_parts = this.tmp.body.length - 1;
                    this.tmp.sel_point = 1;
                    this.tmp.sel_part = ( this.tmp.sel_part === max_parts ? 0 : this.tmp.sel_part + 1 );
                    this.tmp.control.tab = game.keyboard.tab;
                }
                
                //Преключаемся на другую точку
                if( this.tmp.control.wheel !== game.cursor.wheel ) {
                    let max_point = Math.floor( ( this.tmp.body[ this.tmp.sel_part ].length - 6 ) / 2 );
                    if( this.tmp.control.wheel > game.cursor.wheel ) {
                        this.tmp.sel_point = ( this.tmp.sel_point === max_point ? 1 : this.tmp.sel_point + 1 );
                    } else {
                        this.tmp.sel_point = ( this.tmp.sel_point === 1 ? max_point : this.tmp.sel_point - 1 );
                    }
                    this.tmp.control.wheel = game.cursor.wheel;
                }
                
                //Редактируем точку
                if( 
                    this.tmp.control.up !== game.keyboard.up  ||
                    this.tmp.control.down !== game.keyboard.down ||
                    this.tmp.control.left !== game.keyboard.left ||
                    this.tmp.control.right !== game.keyboard.right
                ) {
                    let Ix = 6 + ( this.tmp.sel_point - 1) * 2;
                    let Iy = Ix + 1;
                    let x = this.tmp.body[ this.tmp.sel_part ][ Ix ];
                    let y = this.tmp.body[ this.tmp.sel_part ][ Iy ];
                    
                    if( this.tmp.control.up !== game.keyboard.up ) {
                        this.tmp.control.up = game.keyboard.up;
                        if( y > 0 ) this.tmp.body[ this.tmp.sel_part ][ Iy ]--;
                    }
                    
                    if( this.tmp.control.down !== game.keyboard.down ) {
                        this.tmp.control.down = game.keyboard.down;
                        if( y < game.temp_canvas.height - 1 ) this.tmp.body[ this.tmp.sel_part ][ Iy ]++;
                    }
                    
                    if( this.tmp.control.left !== game.keyboard.left ) {
                        this.tmp.control.left = game.keyboard.left;
                        if( x > 0 ) this.tmp.body[ this.tmp.sel_part ][ Ix ]--;
                    }
                    
                    if( this.tmp.control.right !== game.keyboard.right ) {
                        this.tmp.control.right = game.keyboard.right;
                        if( x < game.temp_canvas.width - 1 ) this.tmp.body[ this.tmp.sel_part ][ Ix ]++;
                    }
                }
            },
            
            //Отрисовка объекта -------------------------------------------------------------------
            draw: function() {
                //Получаем короткие ссылки
                let context = game.canvas.context;
                let body = this.tmp.body;
                if( body === null ) return;
                
                let x = this.tmp.object.tmp.x;
                let y = this.tmp.object.tmp.y;
                
                context.fillStyle = 'rgba(255,0,0,255)';
                for( let i = 6, j = this.tmp.sel_part, selected = false; i < body[ j ].length; i += 2 ) {
                    selected = ( Math.floor( ( i - 4 ) / 2 ) === this.tmp.sel_point );
                    if( selected ) context.fillStyle = 'rgba(60,255,0,255)';
                    context.fillRect( x + body[ j ][ i ], y + body[ j ][ i + 1 ], 1, 1 );
                    if( selected ) context.fillStyle = 'rgba(255,0,0,255)';
                }
            }
        }
    }
};
