import React from 'react';

export default ({value, onChange}) => {
    return (
        <input 
            className='SearchBox' 
            value={value} 
            style={{border: '1px solid red'}}
            onChange={e => onChange && onChange(e.target.value)} 
            placeholder='Search Satellites'
        />
    )
}