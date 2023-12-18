
export function UrlParam(name) {
    var url = new URL(window.location.href),
        result = url.searchParams.get(name);
    return result
}