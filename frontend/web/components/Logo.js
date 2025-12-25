export default function Logo({ size = 32 }) {
  return (
    <img 
      src="/logo.png" 
      alt="MesaFlow" 
      width={size} 
      height={size}
      style={{display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle'}}
    />
  )
}
