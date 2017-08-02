import requests


def main(args_dict):
    headers = {'Content-Type': 'application/json'}
    auth = ('use-token-auth', args_dict['api_token'])
    classes = [nlc_class for nlc_class in args_dict['msg']['classes']
               if nlc_class['confidence'] > 0.1]
    url = ('http://{iot_org_id}.messaging.internetofthings.ibmcloud.com:1883/'
           'api/v0002/device/types/{device_type}/devices/{device_id}/events/'
           'query'.format(**args_dict))
    requests.post(url, headers=headers, json=classes, auth=auth)
    return {'msg': args_dict['msg']['text']}
