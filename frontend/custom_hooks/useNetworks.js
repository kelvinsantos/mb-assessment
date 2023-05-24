import { useState, useEffect } from 'react';
import {
    marketplaceAddress
} from '../config'

const initialState = [
    {
        label: "localhost",
        value: "http://localhost:8545",
        contract_address: marketplaceAddress,
        selected: true
    }
];

export default function useNetworks() {
    const [networks, setNetworks] = useState(initialState);

    useEffect(() => {
        const storedNetworks = window.localStorage.getItem('networks');
        if (storedNetworks)
            setNetworks(JSON.parse(storedNetworks))
        else
            window.localStorage.setItem('networks', JSON.stringify(networks));
    }, [])

    function saveNetworks(networks) {
        setNetworks(networks);

        window.localStorage.setItem('networks', JSON.stringify(networks));
    }

    function setSelected(label) {
        const _networks = networks.map(v => {
            return {
                label: v.label,
                value: v.value,
                contract_address: v.contract_address,
                selected: v.label === label
            }
        })

        setNetworks(_networks);

        window.localStorage.setItem('networks', JSON.stringify(_networks));
    }

    return [networks, saveNetworks, setSelected];
}