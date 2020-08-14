
import _ from 'lodash';

export async function create_team(ts_id, regs) {
  console.log("create", ts_id, regs);
  let body = {
    team: {
      active: true,
      teamset_id: ts_id,
      reg_ids: _.map(regs, (reg) => reg.id),
    }
  };

  let resp = await fetch(window.create_team_path, {
    method: "POST",
    dataType: "json",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "x-csrf-token": window.csrf_token,
    },
  });

  return resp.json();
}

export async function set_active_team(team, active) {
  console.log("set active", team, active);
  let body = { team: { active: active } };
  let path = window.team_path_template.replace("ID", team.id);
  let resp = await fetch(path, {
    method: "PATCH",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "x-csrf-token": window.csrf_token,
    },
  });

  return resp.json();
}

export async function delete_team(team) {
  console.log("delete", team);

  let path = window.team_path_template.replace("ID", team.id);
  let resp = await fetch(path, {
    method: "DELETE",
    dataType: "json",
    contentType: "application/json; charset=UTF-8",
    body: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      "x-csrf-token": window.csrf_token,
    }
  });
  return resp.json();
}
