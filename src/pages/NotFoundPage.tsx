import { Link } from "react-router-dom";
import { Layout } from "../components/Layout";

export function NotFoundPage() {
  return (
    <Layout>
      <section className="rounded-[2rem] bg-white p-10 text-center shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-slate-500">Lost in the maze?</p>
        <h2 className="mt-4 text-4xl font-black text-slate-900">That path does not exist.</h2>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          Head back home and pick the next treasure trail.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-2xl bg-sky-500 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-600"
        >
          Return home
        </Link>
      </section>
    </Layout>
  );
}
