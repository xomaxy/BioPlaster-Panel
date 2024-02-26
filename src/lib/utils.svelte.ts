interface toggle{
    value: boolean | string,
    toggle: ()=>void,
    val_to_boolean?: boolean

}

export function make_toggle(t_value:any=true,f_value:any=false): toggle{
    let value = $state(t_value)
    console.log(value)
    function truth(value: any){
        return (value === t_value) ? true : false
    }
    function toggle(){
        value = (value === t_value) ? f_value : t_value
    }
    if (typeof t_value === 'boolean' && typeof f_value === 'boolean'){
        return  {
            get value(){return value},
            toggle
        }
    } else {
        return {
            get value(){return value},
            toggle,
            get val_to_boolean(){return truth(value)}
        }
    }
}