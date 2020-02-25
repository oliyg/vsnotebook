import * as fs from 'fs';

export function stat(dirPath: string): Promise<fs.Stats> {
    return new Promise<fs.Stats>((resolve, reject) => {
        fs.stat(dirPath, (error, res) => {
            if (error) { reject(error); }
            else { resolve(res); }
        });
    });
}

export function readdir(dirPath: string): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        fs.readdir(dirPath, (error, children) => {
            if (error) { reject(error); }
            else { resolve(children); }
        });
    });
}