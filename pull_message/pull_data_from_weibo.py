#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/5/12 11:11
# @Author  : Evan / Ethan
# @File    : pull_data_from_weibo.py
import requests
import re
import json
import random
import datetime
import urllib3


# 请求函数：获取某一网页上的所有内容
def get_one_page(url):
    # 请求头的书写，包括User-agent,Cookie等  需要补充
    headers = {
        'Host': 'weibo.com',
        'Connection': 'keep-alive',
        'Cache-Control': '',
        'Upgrade-Insecure-Requests': '',
        'User-Agent': '',
        'Accept': '',
        'Sec-Fetch-Site': '',
        'Sec-Fetch-Mode': '',
        'Sec-Fetch-User': '',
        'Sec-Fetch-Dest': '',
        'Accept-Encoding': '',
        'Accept-Language': '',
        'Cookie': ''
    }

    response = requests.get(url, headers=headers, verify=False)  # 利用requests.get命令获取网页html

    if response.status_code == 200:  # 状态为200即为爬取成功
        return response.text  # 返回值为html文档，传入到解析函数当中

    return None


# 解析 nick_name 微博账户页面
def parse_weibo_page(html, to_day, nick_name='专知'):
    html_str = html.replace(' ', '')
    html_str = html_str.replace('\\', '')
    html_str = html_str.replace('&nbsp;', '')
    html_str = html_str.replace('<br>', '')

    # today = '2020-05-12'
    items = re.findall('%s.*?action-type="feed_list_url"' % to_day, html_str)
    items = filter(lambda x: '转发微博' not in x, items)  # 剔除转发的微博 避免内容重复

    out_dict = {}
    for ind, item in enumerate(items):
        tittle = re.findall('(?<="nick-name="%s">n).*?(?=<atitle=")|'
                            '(?<="nick-name="%s">n).*?(?=<asuda-uatrack=")' % (nick_name, nick_name), item)
        
        if not tittle:
            continue
        else:
            tittle = tittle[0]

        url = re.findall('(?<="alt=").*?(?="action-type="feed_list_url")', item)[0]

        # 剔除无中文标题
        if not re.search('[\u4e00-\u9fa5]+', tittle[:50]):
            continue

        # 标题过短 舍弃
        if len(tittle) <= 4:
            continue

        # 简介过长
        if len(tittle) > 50:
            new_title = tittle[:50] + '...'
        else:
            new_title = tittle

        # url 过长
        if len(url) > 60:
            re_url = url.replace('"', '')
            url = re.findall('(?<=alt=).{1,60}$', re_url)
            if url:
                new_url = url[-1]
            else:
                new_url = 'None'
        else:
            new_url = url

        out_dict[new_title] = new_url

    # 过滤掉 url 为 None 的内容
    out_dict = dict(filter(lambda x: x[1] != 'None', out_dict.items()))

    return out_dict


def weather_report_api():
    # 中国天气网接口 只能返回当天天气 深圳天气主页 101280601为深圳城市代码
    r = requests.get('http://www.weather.com.cn/data/sk/101280601.html')
    r.encoding = 'utf-8'
    weath_info = r.json()['weatherinfo']

    dict_wthr = {'城市': weath_info['city'],
                 '气温': weath_info['temp'],
                 '风速': weath_info['WD'] + weath_info['WS']
                 }

    js_info = json.dumps(dict_wthr, sort_keys=False, ensure_ascii=False)

    return js_info


def weather_report_parse_html():
    # 深圳天气首页 返回明天天气 101280601为深圳城市代码
    url = 'http://www.weather.com.cn/weather/101280601.shtml'
    resp = requests.get(url)
    resp.encoding = 'utf-8'
    html_str = resp.text

    st_ind = html_str.index('（明天）')  # 定位 html 中 明天 的位置
    ed_ind = html_str.index('（后天）')

    tmrow_weth_infos = html_str[st_ind:ed_ind]  # 截取 明天的天气情况

    def catch_or_not(may_list):
        if may_list:
            re_info = may_list[0]
        else:
            re_info = '未知'

        return re_info

    may_wth = re.findall('(?<=<p title=").*?(?=" class=)', tmrow_weth_infos)
    wth = catch_or_not(may_wth)

    may_hig_tem = re.findall('(?<=<span>).*?(?=</span>/<i>)', tmrow_weth_infos)
    hig_tem = catch_or_not(may_hig_tem)

    may_low_tem = re.findall('(?<=</span>/<i>).*?(?=℃</i>)', tmrow_weth_infos)
    low_tem = catch_or_not(may_low_tem)

    may_wind = re.findall('(?<=<i><).*?(?=级</i>)', tmrow_weth_infos)
    wind = catch_or_not(may_wind)

    return '深圳今天 %s ，气温 %s-%s °C，风力 %s 级' % (wth, low_tem, hig_tem, wind)


def parse_dict(dict_obj):

    empty_str = ''
    for k, v in dict_obj.items():
        empty_str += '%s\n\n%s\n\n' % (k, v)

    return empty_str


if __name__ == '__main__':
    urllib3.disable_warnings()

    today_date = datetime.date.today()
    tomorrow_date = today_date + datetime.timedelta(days=1)

    today = str(today_date)
    tomorrow = str(tomorrow_date)
    tom_week_int = str(tomorrow_date.weekday() + 1)
    
    # debug 用
    # fake_today = today_date - datetime.timedelta(days=1)
    # fake_tomo = today_date
    # today = str(fake_today)
    # tomorrow = str(fake_tomo)
    # tom_week_int = str(fake_tomo.weekday() + 1)

    int_week = list(map(str, range(1, 9)))
    han_week = ['一', '二', '三', '四', '五', '六', '日']
    int_week_han = dict(zip(int_week, han_week))
    tom_week_han = int_week_han[tom_week_int]

    # AINLP
    ainlp_url = "https://weibo.com/p/1005052703427641/home?from=page_100505&mod=TAB&is_all=1#place"
    ainlp_html = get_one_page(ainlp_url)
    # print(ainlp_html)
    ainlp_dict = parse_weibo_page(ainlp_html, today, 'AINLP')

    # 机器之心Pro
    jqzx_url = 'https://weibo.com/synced?is_all=1#_0'
    jqzx_html = get_one_page(jqzx_url)
    jqzx_dict = parse_weibo_page(jqzx_html, today, '机器之心Pro')

    # 专知
    zhuanzhi_url = 'https://weibo.com/p/1005056347446503/home?from=page_100505&mod=TAB&is_all=1#_rnd1589277965413'
    zhuanzhi_html = get_one_page(zhuanzhi_url)
    zhuanzhi_dict = parse_weibo_page(zhuanzhi_html, today, '专知')

    # 新智元
    xzy_url = 'https://weibo.com/u/5703921756?profile_ftype=1&is_all=1#_0'
    xzy_html = get_one_page(xzy_url)
    xzy_dict = parse_weibo_page(xzy_html, today, '新智元')

    # 深圳天气状况
    weather_info = weather_report_parse_html()

    # 抓取信息过多  每天限量6条
    dict_pool = {**ainlp_dict, **jqzx_dict, **zhuanzhi_dict, **xzy_dict}
    if len(dict_pool) <= 6:
        parse_me = dict_pool
    else:
        parse_me = dict(random.sample(dict_pool.items(), 6))

    with open(r'../message_warehouse/push_me_%s.txt' % today, 'a+', encoding='utf-8') as wr:
        wr.write('大家早上好，今天是 %s 星期%s\n\n' % (tomorrow, tom_week_han))
        wr.write('%s\n\n今日推送内容如下：\n\n' % weather_info)

        wr.write(parse_dict(parse_me))


