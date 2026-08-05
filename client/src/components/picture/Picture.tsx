import { useDrag } from 'react-dnd';

interface PictureProps {
  id: string;
  name: string;
  url: string;
}

function Picture({ id, name, url }: PictureProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'image',
    item: { id, name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <img
      className="ingredients"
      ref={drag}
      src={url}
      width="150px"
      alt={name}
      style={{ border: isDragging ? '5px solid blue' : '0px' }}
    />
  );
}

export default Picture;
