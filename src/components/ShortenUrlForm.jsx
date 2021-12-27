/* eslint no-unused-vars: 1 */
import axios from 'axios';
import React, { useCallback, useState } from 'react';

const ShortenUrlForm = () => {
    const [value, setValue] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const apiEndpoint = 'https://api-ssl.bitly.com/v4/shorten';

    const onChange = useCallback(
        (e) => {

            setValue(e.target.value)
        },
        [setValue],
    );

    const onSubmit = useCallback(async (e) => {
            e.preventDefault();

            setShortUrl(null);
            const data = {
                "long_url": value
            }
            const axiosConfig = {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_BITLY_AUTHORIZATION_TOKEN}`
                }
            };
            
            try {
                const result = await axios.post(apiEndpoint, data, axiosConfig)
                setShortUrl(result.data.id);
            } catch(error) {
                console.log(error);
            }
        },
        [setShortUrl, value],
    );

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="shorten">
                Url:
                <input
                    placeholder="Url to shorten"
                    id="shorten"
                    type="text"
                    value={value}
                    onChange={onChange}
                />
            </label>
            <input type="submit" value="Shorten and copy URL" />
            <div>
                {shortUrl && <p>Shortened url: <a href={`https://${shortUrl}`}>{shortUrl}</a> copied!</p>}
            </div>
        </form>
    );
};

export default ShortenUrlForm;
