import { Class } from "utility-types";
import { Container } from "inversify";
import isPromise from "is-promise";
import { IModuleConfig } from "../types/IModuleConfig";
import { MODULE_OPTIONS, MODULE } from "../types/constants";
import * as check from "../provider/check";
import { ContainerBuilder } from "../container/config/ContainerBuilder";
export function Module(config: IModuleConfig) {
    return (constructor: Class<any>) => {
        var builder = new ContainerBuilder()
        const container = ContainerBuilder.getContainer(builder);
        //TODO add module to children
        Reflect.defineMetadata(MODULE_OPTIONS, config, constructor);
        Reflect.defineMetadata(MODULE, container, constructor);
        if (config.controllers) {
            config.controllers.forEach(controller => {
                Reflect.defineMetadata(MODULE, container, controller);
                builder.add(controller)
            });
        }
        if (config.provider) {
            config.provider.forEach(provider => {
                if (check.IsProvider(provider)) {
                    if (check.isObjectProvider(provider)) {
                        if (check.IsUseClass(provider)) {
                            builder.bind(provider.provide)
                        }
                        else if (check.IsUseValue(provider)) {
                            builder.bind(provider.provide)
                        }
                        else if (check.IsUseFactory(provider)) {
                            builder.bind(provider.provide)
                        }
                    }
                    else if (check.IsConstructor(provider)) {
                        builder.bind(provider)
                    }
                    else {
                        throw new Error("incorrectly provided provider");
                    }
                }
            });
        }
        return constructor;
    };
}