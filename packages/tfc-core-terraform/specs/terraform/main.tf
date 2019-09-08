data "template_file" "sample" {
  template = file("${path.module}/sample.json")
}

resource "local_file" "sample_json" {
  content = data.template_file.sample.rendered
  filename = "${path.module}/.terraform/rendered.json"
}
