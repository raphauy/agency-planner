
type IgProfile = {
    full_name: string;
    biography: string;
    profile_pic_url: string;
    follower_count: number;
}


// const url = 'https://instagram243.p.rapidapi.com/userinfo/raphauy';
// const options = {
//   method: 'GET',
//   headers: {
//     'X-RapidAPI-Key': 'da1f04cc21msh9bae160810f43f8p194ebejsna2bdc0554f82',
//     'X-RapidAPI-Host': 'instagram243.p.rapidapi.com'
//   }
// };

// try {
// 	const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);
// } catch (error) {
// 	console.error(error);
// }
export async function getIgProfile(nick: string): Promise<IgProfile | undefined> {
    // Construyendo la URL con parámetros de consulta
    const url = new URL(`https://instagram243.p.rapidapi.com/userinfo/${nick}`);

    try {
        // Realizando la solicitud fetch
        const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
            'X-RapidAPI-Host': 'instagram243.p.rapidapi.com'
        }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Convirtiendo la respuesta a JSON
        const data = await response.json();
        console.log(data);

        // Asumiendo que la respuesta es un arreglo y obteniendo la URL de la imagen
        const res = {
            full_name: data.data.full_name,
            biography: data.data.biography,
            profile_pic_url: data.data.profile_pic_url,
            follower_count: data.data.follower_count
        }
        return res;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
  
export async function getIgProfileBulkScrapper(nick: string): Promise<IgProfile | undefined> {
    // Construyendo la URL con parámetros de consulta
    const url = new URL('https://instagram-bulk-profile-scrapper.p.rapidapi.com/clients/api/ig/ig_profile');
    url.searchParams.append('ig', nick);
    url.searchParams.append('response_type', 'short');
    url.searchParams.append('corsEnabled', 'false');

    try {
        // Realizando la solicitud fetch
        const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
            'X-RapidAPI-Host': 'instagram-bulk-profile-scrapper.p.rapidapi.com'
        }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        // Convirtiendo la respuesta a JSON
        const data = await response.json();
        console.log(data);

        // Asumiendo que la respuesta es un arreglo y obteniendo la URL de la imagen
        const res = {
            full_name: data[0].full_name,
            biography: data[0].biography,
            profile_pic_url: data[0].profile_pic_url,
            follower_count: data[0].follower_count
        }
        return res;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
  
