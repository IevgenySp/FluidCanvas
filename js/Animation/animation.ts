/**
 * Created by isp on 5/1/16.
 */

export default class Animation {
    globalId: number;
    parameters: Array<any>;
    constructor (parameters?: Array<any>) {
        this.globalId = 0;

        if (parameters) {
            this.parameters = parameters;
        }
    }

    animate (callback: Function, stopCondition: Function): void {
        let self = this;
        
        this.parameters ? callback(...this.parameters, self) : callback(self);

        this.globalId = requestAnimationFrame(
            () => {
                this.animate(callback, stopCondition);
            }
        );
        
        if (this.parameters ? stopCondition(...this.parameters, self) : stopCondition(self)) {
            cancelAnimationFrame(this.globalId);
        }
    }
    
    setNewParameters (parameters: Array<any>) {
        this.parameters = parameters;
    }
}