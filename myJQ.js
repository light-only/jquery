//1.简单事件的实现。
class Jq{
    constructor(args,root){
        if(typeof root === 'undefined'){
            this['prevObject'] = [document];
        }else{
            //这个操作是把上一个Jq对象传递给prevObject
            this['prevObject'] = root;
        }
        if(typeof args === 'object'){
            if(typeof args.length !== 'undefined'){
                //这里说明这个对象获取的是多个
                this.addEles(args);
            }else{
                //这里获取到的是一个
                this[0] = args;
                this.length = 1;
            }
        }else if(typeof args === 'string'){
            let eles = document.querySelectorAll(args);
            this.addEles(eles);
        }else{
            document.addEventListener('DOMContentLoaded',args)
        }
        
    }
    on(eventName,cb){
     let res = eventName.split(" ");
     for(let i = 0;i<this.length;i++){
         for(let j = 0;j<res.length;j++){
            this[i].addEventListener(res[j],cb);
         }
     }
     return this;//on方法可以返回this，但是eq方法不能返还this，如果返回this就会变成原生Dom不能调用对象中的方法。
    }
    addEles(eles){
        for(let i = 0;i<eles.length;i++){
            this[i] = eles[i];
        }
        this.length = eles.length;
    }
    click(cb){
       for(let i = 0;i<this.length;i++){
           this[i].addEventListener('click',cb);
       }
    }
    eq(index){
        return new Jq(this[index],this);
    }
    end(){
        return this['prevObject'];
    }
    css(...args){
        if(args.length === 1){
            //参数是1的
            if(typeof args[0] === 'object'){
                //这个是用来设置多个属性的
                for(let i =0;i<this.length;i++){
                    for(let j in args[0]){
                        this.setStyle(this[i],j,args[0][j]);
                    }
                }
            }else{
                //这个是用来获取属性的，多个元素时只能获取第一个属性值
                    console.log(args[0]);
                    return this.getStyle(this[0],args[0]);
            }
        }else{
            //这是2个参数的，用来设置一个属性的，多个元素的情况
            for(let i = 0;i <this.length;i++){
                this.setStyle(this[i],args[0],args[1]);
            }

        }
    }
    setStyle(ele,styleName,styleValue){
        if(styleName in $.cssHooks){
            console.log(111);
            $.cssHooks[styleName].set(ele,styleValue);
        }
        if(typeof styleValue === 'number' && !$.cssNumber[styleName]){
            styleValue += 'px';
        }
         ele.style[styleName] = styleValue;
    }
    getStyle(ele,styleName){
        if(styleName in $.cssHooks){
            return $.cssHooks[styleName].get(ele);
        }
        return getComputedStyle(ele,null)[styleName];
    }
    animate(...args){
            let timer = 500;
            if(typeof args[1] !== 'function'){
                if(typeof args[1] === 'string'){
                    switch(args[1]){
                        case 'slow' :
                            timer = 1000;
                            break;
                        case 'fast' :
                            timer = 600;
                            break;
                        case 'normal' :
                            timer = 800;
                            break;
                    }
                }else if(typeof args[1] === 'number'){
                    timer = args[1];
                }
            }
            let timerS = timer/1000 +'s'
            for(let i = 0;i<this.length;i++){
                this[i].style.transition =  timerS + ' all';
                for(let j in args[0]){
                   this.setStyle(this[i],j,args[0][j]);
               }
            }
            if(typeof args[args.length - 1] === 'function'){
                document.addEventListener('transitionend',args[args.length - 1 ]);
            }
    }  
}
//用来立足未来提高扩展性，比如以后出了一个新的属性，wh
// $.cssNumber.wh = true;就行了
$.cssNumber = {
    animationIterationCount: true,
    columnCount: true,
    fillOpacity: true,
    flexGrow: true,
    flexShrink: true,
    fontWeight: true,
    gridArea: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnStart: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowStart: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    widows: true,
    zIndex: true,
    zoom: true
}
//提高扩展性：假设我们想要添加一个属性，可以同时设置宽和高wh 
$.cssHooks = {}


function $(args){
    return new Jq(args);
}