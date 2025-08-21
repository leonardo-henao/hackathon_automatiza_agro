type TProps = {
  className?: string;
  title: string;
};

export default function TitleSection({ title, className }: TProps) {
  return <h3 className={`text-2xl text-start opacity-70 ${className}`}>{title}</h3>;
}
