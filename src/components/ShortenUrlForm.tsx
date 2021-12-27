/* eslint no-unused-vars: 1 */
import axios from 'axios';
import React, { useCallback, useState } from 'react';

const ShortenUrlForm: React.FC = () => {
    const [value, setValue] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const [isValidUrl, setIsValidUrl] = useState(true);
    const apiEndpoint = 'https://api-ssl.bitly.com/v4/shorten';

    const getBitLink = (url: string) => {
        const data = {
            "long_url": url
        }
        const axiosConfig = {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_BITLY_AUTHORIZATION_TOKEN}`
            }
        };
        
        return axios.post(apiEndpoint, data, axiosConfig);
    }

    const checkIsValidUrl= (string: string)=> {
        let url;
        
        try {
            url = new URL(string);
        } catch (_) {
            setIsValidUrl(false);
            return false;  
        }
        setIsValidUrl(true);
        return url.protocol === "http:" || url.protocol === "https:";
    }

    const onChange = useCallback(
        (e) => {
            setValue(e.target.value);
        },
        [setValue],
    );

    const onSubmit = useCallback(async (e) => {
            e.preventDefault();
            setShortUrl(null);
            if (checkIsValidUrl(value)) {
                try {
                    const res = await getBitLink(value);
                    setShortUrl(res.data.id);
                }
                catch (error) {
                    alert(`${error} while fetching the bitlink.`);
                }   
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
            <div>
                {!isValidUrl && 'Invalid url.'}
            </div>
        </form>
    );
};

export default ShortenUrlForm;
