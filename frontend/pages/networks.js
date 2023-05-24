import { useEffect, useState } from 'react'

export default function Networks({ networks, saveNetworks }) {
    useEffect(() => {
        setInputList(networks);
    }, [networks])

    const [inputList, setInputList] = useState(networks);

    // handle input change
    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...inputList];
        list[index][name] = value;
        setInputList(list);
    };

    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
    };

    // handle click event of the Add button
    const handleAddClick = () => {
        setInputList([...inputList, { label: "", value: "", selected: false, contract_address: "" }]);
    };

    const handleSaveNetworks = () => {
        saveNetworks(inputList);
    };

    return (
        <div>
            <div className="p-4">
                <h2 className="text-2xl py-2">Networks</h2>
                <div>
                    {
                        inputList.map((network, i) => (
                            <div key={i}>
                                <div className="grid gap-6 mb-6 md:grid-cols-6">
                                    <div>
                                        <label htmlFor="label" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Label</label>
                                        <input
                                            name="label"
                                            type="text"
                                            id="label"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Label"
                                            value={network.label}
                                            onChange={e => handleInputChange(e, i)}
                                            required />
                                    </div>
                                    <div>
                                        <label htmlFor="value" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Network URI</label>
                                        <input
                                            name="value"
                                            type="text"
                                            id="value"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Network URI"
                                            value={network.value}
                                            onChange={e => handleInputChange(e, i)}
                                            required />
                                    </div>
                                    <div>
                                        <label htmlFor="contract_address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Contract Address</label>
                                        <input
                                            name="contract_address"
                                            type="text"
                                            id="contract_address"
                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="Smart Contract Address"
                                            value={network.contract_address}
                                            onChange={e => handleInputChange(e, i)}
                                            required />
                                    </div>
                                    <div className="btn-box">
                                        {inputList.length !== 1 && <button className="font-bold mt-7 bg-pink-500 text-white rounded p-2 shadow-lg" onClick={() => handleRemoveClick(i)}>Remove</button>}
                                        {inputList.length - 1 === i && <button className="font-bold mt-7 bg-pink-500 text-white rounded p-2 shadow-lg ml-2" onClick={handleAddClick}>Add</button>}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <button onClick={handleSaveNetworks} className="font-bold mt-4 bg-pink-500 text-white rounded p-2 shadow-lg">
                    Save networks
                </button>
                {/* <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
            </div >
        </div >
    )
}