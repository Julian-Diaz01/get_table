import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

class Request {
    private axiosInstance: AxiosInstance;

    constructor() {
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public get<T = never>(url: string, params?: never, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        const getConfig = {...config, params};
        return this.axiosInstance.get<T>(url, getConfig);
    }

}

const request = new Request();

export {request};
