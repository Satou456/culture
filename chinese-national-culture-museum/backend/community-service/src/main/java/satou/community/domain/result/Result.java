package satou.community.domain.result;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 后端统一返回结果
 * @param <T>
 */
@Data
@Schema(description = "统一返回结果")
public class Result<T> implements Serializable {

    @Schema(description = "状态码(1为成功，0和其他为失败)")
    private Integer code;
    @Schema(description = "返回信息")
    private String msg;
    @Schema(description = "返回数据")
    private T data;

    public static <T> Result<T> success() {
        Result<T> result = new Result<T>();
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static <T> Result<T> success(T object) {
        Result<T> result = new Result<T>();
        result.data = object;
        result.code = 1;
        result.msg = "success";
        return result;
    }

    public static <T> Result<T> error(String msg) {
        Result result = new Result();
        result.msg = msg;
        result.code = 0;
        return result;
    }

}
