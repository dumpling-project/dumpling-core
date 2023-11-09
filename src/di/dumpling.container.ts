type ConstructorFunction = {new(...args: any[]): any};

export class DumplingContainer{
    private static _instance : DumplingContainer;

    private _wheatInstanceList : Map<ConstructorFunction, any> = new Map<ConstructorFunction, any>();  // Class - Instance of Wheat
    private _wheatDependencyList : Map<ConstructorFunction, Array<ConstructorFunction>> = new Map<ConstructorFunction, Array<ConstructorFunction>>(); // Class - Class of Wheat, Value - Dependency of Wheat

    private _wheatOrderList : Array<ConstructorFunction> = new Array<ConstructorFunction>();          // Order of Wheat Creation

    private constructor(){}

    public static get instance() : DumplingContainer {
        if(!this._instance){
            this._instance = new DumplingContainer();
        }
        return this._instance;
    }

    public addWheatInstance( instanceKey : ConstructorFunction, instance: any){
        this._wheatInstanceList.set(instanceKey, instance);
    }

    public getWheatInstance(wheat: ConstructorFunction){
        return this._wheatInstanceList.get(wheat);
    }

    public addWheatDependency(wheat: ConstructorFunction, dependency: ConstructorFunction[] | undefined){
        if (!dependency) {
            dependency = [];
        }
        this._wheatDependencyList.set(wheat, dependency);
    }

    public getWheatDependency(wheat: ConstructorFunction){
        return this._wheatDependencyList.get(wheat);
    }



    public resolveDi(){
        let visited = new Map();
        let visiting = new Map();
        let wheatList = this._wheatDependencyList;
        let result = new Array<ConstructorFunction>();

        function visit(node : ConstructorFunction){

            if (visiting.get(node)) {
                throw new Error("Cyclic dependency");
            }

            if(!node || visited.get(node)){
                return;
            }
            visiting.set(node, true);

            let children = wheatList.get(node);
            if(children){
                children.forEach(visit);
            }
            visiting.delete(node);
            visited.set(node, true);
            result.push(node);
        }

        for (let [key, value] of wheatList) {
            if(!visited.get(key)){
                try{
                    visit(key);
                } catch (e) {
                    console.log(e);
                    process.exit(1);
                }

            }
        }

        this._wheatOrderList = result;
    }

    public initWheat(){
        this._wheatOrderList.forEach((wheat : ConstructorFunction )=>{
            this.createWheatInstance(wheat);
        })
    }
    public createWheatInstance(wheat: ConstructorFunction){
        let dependency = this.getWheatDependency(wheat);
        console.log(dependency);
        let dependencyInstance = new Array<any>();
        if(dependency){
            dependency.forEach((dep)=>{
                dependencyInstance.push(this.getWheatInstance(dep));
            })
        }

        this.addWheatInstance(wheat,new wheat(...dependencyInstance));
        console.log("Created instance of " + wheat.name);
    }

}