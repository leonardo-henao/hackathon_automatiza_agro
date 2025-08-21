type TProps = {
  title: string;
};

export default function TitleSection({ title }: TProps) {
  return <h3 className="text-2xl text-start opacity-70">{title}</h3>;
}
