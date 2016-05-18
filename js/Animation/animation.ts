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
        this.parameters ? callback(...this.parameters) : callback();

        this.globalId = requestAnimationFrame(
            () => {
                this.animate(callback, stopCondition);
            }
        );
        
        if (this.parameters ? stopCondition(...this.parameters) : stopCondition()) {
            cancelAnimationFrame(this.globalId);
        }
    }
    
    setNewParameters (parameters: Array<any>) {
        this.parameters = parameters;
    }
}