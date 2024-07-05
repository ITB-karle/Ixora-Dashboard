export async function apiRequest(url, data = null, method = data ? 'POST' : 'GET', authentication = true) {
    let accessToken = null;

    // Add authentication header if authentication is true
    if (authentication) {
        accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('Access token not found in local storage');
        }
    } else {
        console.log("error");
    }

    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    if (accessToken) {
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
    }

    const requestOptions = {
        method: method,
        headers: myHeaders,
        body: null, // Initialize body as null
    };

    // Initialize formData if data is provided
    // if (data) {
    //     const formData = new FormData();
    //     for (const key in data) {
    //         formData.append(key, data[key]);
    //     }
    //     requestOptions.body = formData; // Assign formData to requestOptions.body
    // }
    if (data) {
        console.log(data)
        const formData = new FormData();

    for (let key in data) {
        // console.log(data[key])

        if (data[key]?.url) {
            const uri = data[key].url;
            const type = data[key].mimeType;
            const name = data[key].fileName ?? 'image.jpg';
            formData.append(key, {
                uri: uri,
                type: type,
                name: name,
                fileName: name,
                size: data[key].fileSize,
            });
        } else {
            formData.append(key, data[key]);
        }
    }

    requestOptions.body = formData; // Assign formData to requestOptions.body
}

    try {
        const response = await fetch(url, requestOptions);

        // Check if the response status is 401
        if (response.status === 401) {
            console.error('Unauthorized access - redirecting to login.');
            window.location.href = '/signin';  // Adjust the path to your login page as necessary
            return;  // Exit the function after redirect
        }
        const responseData = await response.json();
        return { ...responseData, http_status: response.status};
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}