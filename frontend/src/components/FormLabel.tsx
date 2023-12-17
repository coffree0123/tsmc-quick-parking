import React from 'react'

const FormLabel = (props: { label: string, style?: React.CSSProperties }): React.ReactElement => <div style={{ width: '50px', ...props.style }}>{props.label}</div>

export default FormLabel
