data "template_file" "sample" {
  template = file("${path.module}/sample.json")
}
