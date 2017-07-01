import axios, { AxiosResponse } from 'axios';
import * as BluebirdPromise from 'bluebird';
import {
  vec3,
  mat4,
} from 'gl-matrix';
import * as OBJ from 'webgl-obj-loader';

export default class Model {
  private position: vec3;

  private rotationMatrix: mat4;
  private translationMatrix: mat4;

  public vertices: Float32Array;
  public normals: Float32Array;
  public textureUVs: Float32Array;
  public indices: Uint16Array;

  public ambient: number;
  public lambertian: number;
  public specular: number;

  public texture: any;

  constructor() {
    this.position = vec3.fromValues(0, 0, 0);
    this.rotationMatrix = mat4.create();
    this.translationMatrix = mat4.create();

    this.ambient = 0.2;
    this.lambertian = 0.8;
    this.specular = 300;
  }

  public loadOBJFile(url: string): Promise<void> {
    return axios
      .get(url)
      .then((res: AxiosResponse) => {
        let model: OBJ.Mesh;
        let maxTextureVal: number;

        model = new OBJ.Mesh(res.data);
        maxTextureVal = Math.max.apply(null, model.textures);

        this.vertices = new Float32Array(model.vertices);
        this.normals = new Float32Array(model.vertexNormals);
        this.textureUVs = new Float32Array(model.textures.map((val: number) => val / maxTextureVal));
        this.indices = new Uint16Array(model.indices);

        return BluebirdPromise.resolve();
      })
      .catch(console.error);
  }

  public loadImageForTexture(url: string): Promise<void> {
    let img: any;

    img =  new Image();

    return new BluebirdPromise((resolve: () => {}, reject: (err: Error) => {}) => {
      img.src = url;
      img.onload = resolve;
    })
    .then(() => {
      this.texture = img;
      return BluebirdPromise.resolve();
    });
  }

  public translate(dx: number|vec3, dy?: number, dz?: number): void {
    if (typeof dx === 'number') {
      this.position = vec3.add(vec3.create(), vec3.fromValues(dx, dy, dz), this.position);
    } else {
      this.position = vec3.add(vec3.create(), dx, this.position);
    }
  }

  public rotate(rad: number, axis: vec3): void {
    this.rotationMatrix = mat4.multiply(mat4.create(), mat4.fromRotation(mat4.create(), rad, axis), this.rotationMatrix);
  }

  public modelMat(): mat4 {
    return mat4.multiply(mat4.create(), this.translationMatrix, this.rotationMatrix);
  }

  public normalMat(): mat4 {
    let invertedModelMat: mat4;

    invertedModelMat = mat4.invert(mat4.create(), this.modelMat());
    return mat4.transpose(mat4.create(), invertedModelMat);
  }
}
