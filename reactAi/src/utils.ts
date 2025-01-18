export function getTokenNumber(text: string): number {
    // 按以下规则匹配：
    const regex = /[a-zA-Z0-9]+|[\u4e00-\u9fa5]|[^\s\w\u4e00-\u9fa5]+/g;

    // 匹配所有 token，并过滤掉 null 值
    let tokens = (text.match(regex) || []).filter(token => token !== null);

    // 处理长字符串（包括长英文、长数字、长特殊符号），按每 10 个字符拆分
    tokens = tokens.flatMap(token => {
        if ((/^[a-zA-Z]+$/.test(token) || /^[0-9]+$/.test(token) || /^[^\w\s]+$/.test(token)) && token.length > 10) {
            // 如果是长英文、长数字或长特殊符号，按每 10 个字符拆分
            return token.match(/.{1,10}/g) || []; // 防止 null 返回
        }
        return token;
    });

    return tokens.length; // 返回 token 数量
}