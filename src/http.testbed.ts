import { async, getTestBed, TestBed } from '@angular/core/testing';
import { BaseRequestOptions, Http, Response, ResponseOptions, ResponseOptionsArgs, XHRBackend } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppComponent } from './app/app.component';


export class HttpTestbed {

    static backend: MockBackend;
    static connections: ConnectionMock[] = [];

    public static configureTestingModule(moduleConfig: any) {
        this.connections = [];
        const mockModuleConfig = this.prepareModuleConfig(moduleConfig);
        TestBed.configureTestingModule(mockModuleConfig).compileComponents();
        this.configureMockConnections();
    }

    private static prepareModuleConfig(moduleConfig: any): any {
        moduleConfig = moduleConfig || {};
        moduleConfig.providers = moduleConfig.providers || [];
        moduleConfig.providers = moduleConfig.providers.concat([
            MockBackend,
            BaseRequestOptions,
            this.getHttpMock()
        ]);
        return moduleConfig;
    }

    private static configureMockConnections() {
        const testbed = getTestBed();
        this.backend = testbed.get(MockBackend);
        this.backend.connections.subscribe((connection: MockConnection) => {
            this.connections.forEach(connectionMock => {
                if (connectionMock.urlPattern.test(connection.request.url)) {
                    const responseOptions = new ResponseOptions(connectionMock.options);
                    const response = new Response(responseOptions);
                    connection.mockRespond(response);
                }
            });
        });
    }

    private static getHttpMock(): any {
        return {
            deps: [
                MockBackend,
                BaseRequestOptions
            ],
            provide: Http,
            useFactory: (back: XHRBackend, defaultOptions: BaseRequestOptions) => {
                return new Http(back, defaultOptions);
            }
        }
    }

    public static setupConnectionMock(urlPattern: string, body: any) {
        this.setupConnection(this.createConnectionMock(urlPattern, body));
    }

    private static createConnectionMock(urlPattern: string, body: any): ConnectionMock {
        return {
            urlPattern: new RegExp(urlPattern),
            options: {
                status: 200,
                body: body
            }
        };
    }

    public static setupConnection(connectionMock: ConnectionMock) {
        this.connections.push(connectionMock);
    }
}

export class ConnectionMock {
    urlPattern: RegExp;
    options: ResponseOptionsArgs;
}
