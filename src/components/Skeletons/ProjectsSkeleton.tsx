import Skeleton from './Skeleton';

export default function ProjectsSkeleton() {
  return (
    <Skeleton.Container>
      <Skeleton.Title />
      <Skeleton.Vertical
        className="mt-4"
        amount={2}
        shape={<Skeleton.Tile />}
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
