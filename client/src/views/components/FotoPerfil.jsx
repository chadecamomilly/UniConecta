export default function FotoPerfil({ photoURL, displayName, size = 80 }) {
  const letra = displayName ? displayName.charAt(0).toUpperCase() : "?";

  if (photoURL) {
    return (
      <img
        src={photoURL || "https://via.placeholder.com/80"}
        alt="Foto de perfil"
        className="rounded-full object-cover"
        style={{ 
          width: `${size}px`, 
          height: `${size}px` 
        }}
      />
    );
  }

  return (
    <div
      className="
        flex items-center justify-center 
        rounded-full 
        border-2 border-white 
        mx-auto
        bg-gray-300 text-gray-700
        font-bold
      "
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size * 0.4}px`,
      }}
    >
      {letra}
    </div>
  );
}