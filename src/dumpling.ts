import { FrontController } from './controller/front-controller/front.controller.ts';
import * as path from 'path';
import * as fs from 'fs';
import { DumplingContainer } from './di/dumpling.container.ts';
import { MetadataContainer } from './metadata/metadata.container.ts';
import { WHEAT } from './metadata/key/wheat.metadata.key.ts';

export class Dumpling {
  constructor() {}

  public bootstrap(): void {
    const projectDir = this.getFilesFromDir(path.join(import.meta.dir, '..', 'test'));
    const registerPromise = this.findWheat(projectDir);
    registerPromise.then((wheatList) => {
      const flatWheatList = wheatList.flat();
      const dumplingContainer = DumplingContainer.instance;
      this.resolveDi(flatWheatList, dumplingContainer);
      this.injectEssentialWheat();
      this.run();
    });
  }

  public run(): void {
    Bun.serve({
      port: 4000,
      async fetch(request: Request) {
        const frontController = DumplingContainer.instance.getWheatInstance(FrontController);
        return await frontController.router(request);
      },
    });
  }

  private getFilesFromDir(dir: string): string[] {
    const subDirs = fs.readdirSync(dir, { withFileTypes: true });
    const files = subDirs.map((subDir) => {
      const res = path.resolve(dir, subDir.name);
      return subDir.isDirectory() ? this.getFilesFromDir(res) : res;
    });

    return Array.prototype.concat(...files);
  }

  private findWheat(files: string[]) {
    const imports = files.map((file) => {
      if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        return import(file).then((module) => {
          const wheatList = Object.keys(module).map((key) => {
            const exportedEntity = module[key];
            if (typeof exportedEntity === 'function') {
              const isWheat = MetadataContainer.getClassMetadata<boolean>(exportedEntity, WHEAT);
              if (isWheat) {
                return exportedEntity;
              }
            }
          });
          return wheatList;
        });
      }
    });

    return Promise.all(imports);
  }

  private resolveDi(wheatList: any[], dumplingContainer: DumplingContainer) {
    wheatList.forEach((wheat) => {
      dumplingContainer.addWheatDependency(wheat, Reflect.getMetadata('design:paramtypes', wheat));
    });

    dumplingContainer.resolveDi();
    dumplingContainer.initWheat();
  }

  private injectEssentialWheat() {
    DumplingContainer.instance.addWheatInstance(FrontController, new FrontController());
  }
}
