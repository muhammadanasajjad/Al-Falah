export async function requireFromUrl(url, json = true) {
    let ret;
    await fetch(url)
        .then((value) => {
            if (!value.ok) throw value.statusText;
            console.log(value);
            return json ? value.json() : value.text();
        })
        .then((data) => (ret = data))
        .catch((error) => console.error(error));
    return ret;
}
