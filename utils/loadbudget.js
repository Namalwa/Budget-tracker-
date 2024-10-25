 import fs from 'fs';

function loadBudget(path){
    const loadedBudget = fs.readFileSync(path, "utf8");
    if (!loadedBudget){
        return [];
    }
    return JSON.parse(loadedBudget);
}
export default loadBudget