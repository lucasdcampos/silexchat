interface AvatarProps {
  avatarUrl?: string | null;
  username?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ avatarUrl, username, size = 'md' }: AvatarProps) {
  const sizeClasses = size === 'md' ? 'h-11 w-11' : size == 'lg' ? 'h-20 w-20' : 'h-9 w-9';
  const textSize = size === 'md' ? 'text-base' : size == 'lg'? 'text-lg' : 'text-sm';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username ? `${username}'s avatar` : 'User avatar'}
        className={`${sizeClasses} rounded-full object-cover flex-shrink-0`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
          const fallback = document.createElement('div');
          fallback.className = `flex items-center justify-center bg-gray-600 ${sizeClasses} rounded-full font-bold text-white ${textSize}`;
          fallback.innerText = username ? username.charAt(0).toUpperCase() : '';
          e.currentTarget.parentNode?.appendChild(fallback);
        }}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center bg-gray-600 ${sizeClasses} rounded-full font-bold text-white ${textSize} flex-shrink-0`}>
      {username ? username.charAt(0).toUpperCase() : ''}
    </div>
  );
}