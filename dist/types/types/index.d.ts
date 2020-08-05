export declare type Method = 'get' | 'GET' | 'delete' | 'Delete' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH';
export interface AxiosRequestConfig {
    url: string;
    method?: Method;
    data?: any;
    paramas?: any;
}
