export default function PricingBox({ price }: { price: number }) {
  return <div className="font-mono text-2xl text-cyan-400">₹{price}</div>;
}
