interface Props {
  children: React.ReactNode;
  alignTop?: boolean;
}

export default function GradientBackground({ children, alignTop = false }: Props) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex ${alignTop ? "items-start pt-10" : "items-center"
        } justify-center p-4`}
    >
      {children}
    </div>
  );
}
