import React,{ useState } from "react";

const modalOverlayStyles = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    zIndex:"10"
}

const modalStyle ={
    background: 'white', padding: '20px', borderRadius: '8px',
    minWidth: '300px', position: 'relative',
}

export default function Modal({ onClose, children }){
    return (
        <div style={modalOverlayStyles}>
            <div style={modalStyle}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ zIndex: 1 }}
                    >
                        X
                    </button>
                </div>
                <div style={{ marginTop: '10px' }}>
                    {children}
                </div>
            </div>
        </div>
    )
}
