import type { ActionFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createList } from "~/models/list.server";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    listname: string | undefined;
  };
  fields?: {
    listname: string;
  };
};
const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const listname = await form.get("listname");
  invariant(listname, "Please Provide a valid list name!");
  const errors = {};
  // return data if we have errors
  if (Object.keys(errors).length) {
    return json(errors, { status: 422 });
  }
  if (typeof listname !== "string" || listname.length < 3) {
    return badRequest({
      formError: `Form not submitted correctly. Please re-fill and submit again!`,
    });
  }
  const result = await createList({ listname, username: "john" });
  return redirect("/");
};

export default function CreateList() {
  const errors = useActionData<ActionData>();
  return (
    <section>
      <Form method="post">
        <label htmlFor="listname">List name</label>
        <input id="listname" name="listname" type="text" />
        <p>
          {errors?.fieldErrors ? (
            <small style={{ color: "red" }}>
              {errors?.fieldErrors?.listname} has to be filled correctly!
            </small>
          ) : null}
        </p>
        <button>Create</button>
      </Form>
      <Link to="/lists">back</Link>
    </section>
  );
}
