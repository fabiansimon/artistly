import Skeleton from './Skeleton';

export default function HomeSkeleton() {
  return (
    <Skeleton.Container>
      <Skeleton.Title />
      <Skeleton.Horizontal
        className="mt-4"
        amount={10}
        shape={<Skeleton.Box />}
      />
      <Skeleton.Title className="mt-8" />
      <Skeleton.Vertical
        className="mt-4"
        amount={3}
        shape={<Skeleton.Tile />}
      />
    </Skeleton.Container>
  );
}
