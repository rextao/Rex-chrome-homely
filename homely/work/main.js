(function () {
    chrome.runtime.onMessage.addListener(
        function (request) {
            if (request.action === 'getAllApi' ){
                let result = [];
                const tableBodyTr = document.querySelectorAll('.ant-table-tbody tr');
                tableBodyTr.forEach(el => {
                    const td = el.querySelectorAll('td');
                    const text = td[1].querySelector('.path').textContent;
                    const method = td[2].querySelector('.colValue').textContent;
                    const api = td[2].querySelector('.path').textContent;
                    result.push({
                        method, // 请求方法
                        api, // 请求url
                        text, // 注释
                    });
                    // result += `${method} ${api} ${text}\n`;
                });
                chrome.runtime.sendMessage(
                    { data: JSON.stringify(result) }
                );
            }
            if (request.action === 'getApi' ){
                let result = [];
                const tableBodyTr = document.querySelectorAll('.interface-detail__container .interface-detail__item');
                const text = tableBodyTr[0].querySelectorAll('span')[1].textContent;
                const group = tableBodyTr[4].querySelectorAll('span');
                const method = group[2].textContent;
                const api =  group[3].textContent;
                    result.push({
                    method, // 请求方法
                    api, // 请求url
                    text, // 注释
                });
                chrome.runtime.sendMessage(
                    { data: JSON.stringify(result) }
                );
            }
        }
    );
})();
